<?php

namespace App\Http\Controllers\POS;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\T_Sales;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

// Request
use App\Http\Requests\POS\POSRequest;
use App\Models\T_Logs;
use App\Models\T_Modules;
use App\Models\T_Sale_Items;
use App\Models\T_transaction;
use App\Enums\Inventory\InventoryStatus;
// Repository
use App\Repositories\POS\POSRepository;
use App\Repositories\Tax\TaxRepository;
use App\Repositories\Token\TokenRepository;
use App\Services\Xendit\XenditService;
use Illuminate\Support\Facades\Log;

class CashierController extends Controller
{
    protected $POSRepository, $TaxRepository, $TokenRepository;

    public function __construct(POSRepository $POSRepository, TaxRepository $TaxRepository, TokenRepository $TokenRepository)
    {
        $this->POSRepository = $POSRepository;
        $this->TaxRepository = $TaxRepository;
        $this->TokenRepository = $TokenRepository;
    }

    public function index()
    {
        $getAll = $this->POSRepository->getAll();

        $getTaxSettings = $this->TaxRepository->getTaxSettings();
        $balance = $this->TokenRepository->getValidToken();

        return Inertia::render('POS/Index', [
            'products' => fn() => $getAll,
            'taxSetting' => $getTaxSettings,
            'balance' => $balance,
        ]);
    }

    public function store(POSRequest $request)
    {
        try {

            $result = $this->POSRepository->store(
                $request->validated()
            );

            return response()->json($result);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function paymentStatus(string $invoice, XenditService $xenditService)
    {
        $sale = T_Sales::where(
            'invoice_number',
            $invoice
        )->first();

        if (!$sale) {
            return response()->json([
                'message' => 'Sale tidak ditemukan.',
            ], 404);
        }

        $staff = auth()->user()->staff;
        if (!$staff || (int) $sale->cashier_id !== (int) $staff->id) {
            return response()->json([
                'message' => 'Anda tidak berwenang mengakses transaksi ini.',
            ], 403);
        }

        $transaction = T_transaction::where(
            'sale_id',
            $sale->id
        )->first();

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction tidak ditemukan.',
            ], 404);
        }

        if (
            $transaction->payment_method === 'E-PAYMENT' &&
            $transaction->status === 'pending' &&
            $sale->status === 'pending'
        ) {
            $store = auth()->user()->store;
            $xenditSetting = $store?->xenditSetting;

            if (!$xenditSetting || !$xenditSetting->is_connected || !$xenditSetting->api_key) {
                return response()->json([
                    'message' => 'Pengaturan Xendit toko belum siap.',
                ], 422);
            }

            try {
                $session = $xenditService->getPaymentSession(
                    $xenditSetting->api_key,
                    $transaction->reference_number,
                );

                if (
                    !$session ||
                    (
                        isset($session['payment_session_id']) &&
                        $session['payment_session_id'] !== $transaction->reference_number
                    ) ||
                    ($session['reference_id'] ?? null) !== $sale->invoice_number
                ) {
                    Log::error('Xendit payment session does not match POS transaction', [
                        'invoice_number' => $sale->invoice_number,
                        'transaction_id' => $transaction->id,
                    ]);

                    return response()->json([
                        'message' => 'Sesi pembayaran Xendit tidak cocok dengan transaksi POS.',
                    ], 502);
                }

                if (strtoupper((string) ($session['status'] ?? '')) === 'COMPLETED') {
                    $this->completePendingPayment($sale->invoice_number);
                    $sale->refresh();
                    $transaction->refresh();
                }
            } catch (\Throwable $e) {
                report($e);

                return response()->json([
                    'message' => 'Status pembayaran belum dapat diverifikasi ke Xendit.',
                ], 502);
            }
        }

        return response()->json([
            'sale' => $sale,
            'transaction' => $transaction,
        ]);
    }

    private function completePendingPayment(string $invoice): void
    {
        DB::transaction(function () use ($invoice) {
            $sale = T_Sales::where('invoice_number', $invoice)
                ->lockForUpdate()
                ->firstOrFail();
            $transaction = T_transaction::where('sale_id', $sale->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $transaction->status === 'completed' ||
                $sale->status === 'completed'
            ) {
                return;
            }

            if (
                $transaction->payment_method !== 'E-PAYMENT' ||
                $transaction->status !== 'pending' ||
                $sale->status !== 'pending'
            ) {
                return;
            }

            $userId = $sale->cashier?->users_id ?? auth()->id();
            if (!$userId) {
                throw new \RuntimeException(
                    'User toko tidak ditemukan untuk mencatat pergerakan stok.'
                );
            }

            $module = T_Modules::firstOrCreate([
                'name' => 'Product',
            ]);

            $saleItems = T_Sale_Items::where('sale_id', $sale->id)->get();
            foreach ($saleItems as $saleItem) {
                $product = Product::findOrFail($saleItem->product_id);
                $inventory = $product->inventory()
                    ->where('isActive', InventoryStatus::Active)
                    ->lockForUpdate()
                    ->first();

                if (!$inventory) {
                    throw new \RuntimeException(
                        "Inventory untuk product {$product->name} tidak ditemukan."
                    );
                }

                if ($inventory->qty < $saleItem->quantity) {
                    throw new \RuntimeException(
                        "Stok {$product->name} tidak mencukupi."
                    );
                }

                $oldQty = (int) $inventory->qty;
                $inventory->decrement('qty', $saleItem->quantity);
                $inventory->update([
                    'last_stock_out' => $saleItem->quantity,
                ]);

                T_Logs::create([
                    'module_id' => $module->id,
                    'user_id' => (string) $userId,
                    'references_id' => $product->id,
                    'old_value' => $oldQty,
                    'new_value' => $oldQty - $saleItem->quantity,
                    'description' => "POS sale {$sale->invoice_number}: inventory stock out.",
                ]);
            }

            $transaction->update([
                'status' => 'completed',
                'processed_at' => now(),
            ]);
            $sale->update([
                'status' => 'completed',
            ]);
        });
    }

    public function paymentSessionKey(string $invoice, XenditService $xenditService)
    {
        $sale = T_Sales::where('invoice_number', $invoice)->first();

        if (!$sale) {
            return response()->json([
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        $staff = auth()->user()->staff;
        if (!$staff || (int) $sale->cashier_id !== (int) $staff->id) {
            return response()->json([
                'message' => 'Anda tidak berwenang mengakses transaksi ini.',
            ], 403);
        }

        $transaction = T_transaction::where('sale_id', $sale->id)->first();
        if (
            !$transaction ||
            $transaction->payment_method !== 'E-PAYMENT' ||
            $transaction->status !== 'pending' ||
            $sale->status !== 'pending'
        ) {
            return response()->json([
                'message' => 'Sesi pembayaran tidak lagi aktif.',
            ], 409);
        }

        $store = auth()->user()->store;
        $xenditSetting = $store?->xenditSetting;
        if (!$xenditSetting || !$xenditSetting->is_connected || !$xenditSetting->api_key) {
            return response()->json([
                'message' => 'Pengaturan Xendit toko belum siap.',
            ], 422);
        }

        try {
            $session = $xenditService->getPaymentSession(
                $xenditSetting->api_key,
                $transaction->reference_number,
            );
        } catch (\Exception $e) {
            report($e);

            return response()->json([
                'message' => 'Tidak dapat memulihkan sesi pembayaran Xendit.',
            ], 502);
        }

        if (
            !$session ||
            ($session['reference_id'] ?? null) !== $sale->invoice_number ||
            empty($session['components_sdk_key'])
        ) {
            return response()->json([
                'message' => 'Xendit tidak mengembalikan key untuk sesi pembayaran ini.',
            ], 502);
        }

        return response()->json([
            'components_sdk_key' => $session['components_sdk_key'],
        ]);
    }

    public function cancelPayment(string $invoice)
    {
        return DB::transaction(function () use ($invoice) {
            $sale = T_Sales::where('invoice_number', $invoice)
                ->lockForUpdate()
                ->first();

            if (!$sale) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi tidak ditemukan.',
                ], 404);
            }

            $staff = auth()->user()->staff;
            if (!$staff || (int) $sale->cashier_id !== (int) $staff->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak berwenang membatalkan transaksi ini.',
                ], 403);
            }

            $transaction = T_transaction::where('sale_id', $sale->id)
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pembayaran tidak ditemukan.',
                ], 404);
            }

            if ($transaction->payment_method !== 'E-PAYMENT') {
                return response()->json([
                    'success' => false,
                    'message' => 'Hanya pembayaran E-Payment yang dapat dibatalkan dari sini.',
                ], 422);
            }

            if (
                $transaction->status !== 'pending' ||
                $sale->status !== 'pending'
            ) {
                return response()->json([
                    'success' => false,
                    'message' => $transaction->status === 'completed'
                        ? 'Pembayaran sudah berhasil dan tidak dapat dibatalkan.'
                        : 'Transaksi tidak lagi berstatus pending.',
                    'status' => $transaction->status,
                ], 409);
            }

            $transaction->update([
                'status' => 'cancelled',
                'processed_at' => now(),
            ]);

            $sale->update([
                'status' => 'cancelled',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dibatalkan.',
                'status' => 'cancelled',
            ]);
        });
    }

    public function paymentSuccess(Request $request)
    {
        // dd('PAYMENT SUCCESS', $request->query('invoice'));
        $invoiceNumber = $request->query('invoice');

        if (!$invoiceNumber) {
            abort(404);
        }

        $sale = T_Sales::where(
            'invoice_number',
            $invoiceNumber
        )->first();

        if (!$sale) {
            abort(404);
        }

        $transaction = T_transaction::where(
            'sale_id',
            $sale->id
        )->first();

        if (!$transaction) {
            abort(404);
        }

        return Inertia::render('POS/PaymentSuccess', [
            'sale' => $sale,
            'transaction' => $transaction,
        ]);
    }
}
