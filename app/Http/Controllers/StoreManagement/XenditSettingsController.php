<?php

namespace App\Http\Controllers\StoreManagement;

use App\Enums\XenditSettings\XenditWebhookType;
use App\Http\Requests\StoreManagement\Xendit\UpdateXenditSettingRequest;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Repositories\Xendit\XenditSettingsRepository as XenditXenditSettingsRepository;
use App\Services\Xendit\XenditService;
use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\T_Sale_Items;
use App\Enums\Inventory\InventoryStatus;
use App\Models\T_Stores;
use Illuminate\Support\Facades\DB;
use App\Models\T_transaction;

use Illuminate\Support\Facades\Log;

class XenditSettingsController extends Controller
{
    public function __construct(
        private XenditService $xenditService,
        private XenditXenditSettingsRepository $xenditSettingsRepository,
    ) {}

    public function index()
    {
        $store = auth()->user()->store;
        // dd($store);
        $setting = $this->xenditSettingsRepository->findByStore($store);

        return Inertia::render('StoreManagement/XenditSettings/Index', [
            'xenditSetting' => $setting ? [
                'environment' => $setting->environment,
                'is_connected' => $setting->is_connected,
                'callback_url' => route('webhooks.xendit', $store->id),
            ] : null,
        ]);
    }

    public function update(UpdateXenditSettingRequest $request)
    {
        $store = auth()->user()->store;

        $callbackUrl = route('webhooks.xendit', $store->id);

        // dd($callbackUrl);

        $result = $this->xenditService->registerWebhook(
            apiKey: $request->validated('api_key'),
            type: XenditWebhookType::Invoice,
            callbackUrl: $callbackUrl,
        );

        if (!$result) {
            return back()->withErrors([
                'api_key' => 'Gagal terhubung ke Xendit.',
            ]);
        }

        $this->xenditSettingsRepository->updateOrCreate($store, [
            'environment' => $request->validated('environment'),
            'api_key' => $request->validated('api_key'),
            'webhook_token' => $result['callback_token'] ?? null,
            'is_connected' => true,
        ]);

        return back();
    }

    public function test(UpdateXenditSettingRequest $request)
    {
        $isValid = $this->xenditService->testApiKey($request->validated('api_key'));

        return response()->json(['success' => $isValid], $isValid ? 200 : 422);
    }

    public function handle(Request $request, $storeId)
    {
        Log::info('Xendit webhook received', [
            'store_id' => $storeId,
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        $store = T_Stores::find($storeId);

        if (!$store) {
            Log::warning('Xendit webhook store not found', [
                'store_id' => $storeId,
            ]);

            return response()->json([
                'message' => 'Store not found.',
            ], 404);
        }

        $setting = $store->xenditSetting;

        if (!$setting) {
            Log::warning('Xendit setting not found', [
                'store_id' => $storeId,
            ]);

            return response()->json([
                'message' => 'Xendit setting not found.',
            ], 404);
        }

        $callbackToken = $request->header('x-callback-token');

        if (
            !$callbackToken ||
            !$setting->webhook_token ||
            !hash_equals(
                $setting->webhook_token,
                $callbackToken
            )
        ) {
            Log::warning('Invalid Xendit callback token', [
                'store_id' => $storeId,
            ]);

            return response()->json([
                'message' => 'Invalid callback token.',
            ], 401);
        }

        $payload = $request->all();

        if (($payload['status'] ?? null) !== 'PAID') {
            return response()->json([
                'received' => true,
                'message' => 'Webhook received but payment is not PAID.',
            ]);
        }

        DB::transaction(function () use ($payload) {

            $transaction = T_transaction::where(
                'reference_number',
                $payload['id']
            )
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                Log::warning('Xendit transaction not found', [
                    'xendit_invoice_id' => $payload['id'] ?? null,
                    'external_id' => $payload['external_id'] ?? null,
                ]);

                return;
            }

            if ($transaction->status === 'completed') {
                Log::info('Xendit webhook already processed', [
                    'transaction_id' => $transaction->id,
                    'reference_number' => $transaction->reference_number,
                ]);

                return;
            }

            $sale = $transaction->sales()
                ->lockForUpdate()
                ->first();

            if (!$sale) {
                throw new \Exception(
                    'Sale tidak ditemukan untuk transaction ID ' .
                    $transaction->id
                );
            }

            $saleItems = T_Sale_Items::where(
                'sale_id',
                $sale->id
            )->get();

            foreach ($saleItems as $saleItem) {

                $product = Product::findOrFail($saleItem->product_id);

                if (!$product) {
                    throw new \Exception(
                        'Product ID ' .
                        $saleItem->product_id .
                        ' tidak ditemukan.'
                    );
                }

                $inventory = $product->inventory()
                    ->where(
                        'isActive',
                        InventoryStatus::Active
                    )
                    ->lockForUpdate()
                    ->first();

                if (!$inventory) {
                    throw new \Exception(
                        'Inventory untuk product ' .
                        $product->name .
                        ' tidak ditemukan.'
                    );
                }

                if ($inventory->qty < $saleItem->quantity) {
                    throw new \Exception(
                        'Stok ' .
                        $product->name .
                        ' tidak mencukupi.'
                    );
                }

                $inventory->decrement(
                    'qty',
                    $saleItem->quantity
                );

                $inventory->update([
                    'last_stock_out' => $saleItem->quantity,
                ]);
            }

            $transaction->update([
                'status' => 'completed',
                'processed_at' => now(),
            ]);

            $sale->update([
                'status' => 'completed',
            ]);

            Log::info('Xendit payment processed successfully', [
                'transaction_id' => $transaction->id,
                'sale_id' => $sale->id,
                'xendit_invoice_id' => $payload['id'],
                'external_id' => $payload['external_id'] ?? null,
            ]);
        });

        return response()->json([
            'received' => true,
        ]);
    }
}