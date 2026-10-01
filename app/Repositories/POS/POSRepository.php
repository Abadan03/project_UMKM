<?php 
namespace App\Repositories\POS;

use App\Enums\Inventory\InventoryStatus;
use App\Models\User;
use App\Models\T_Staff;
use App\Models\Product;
use App\Models\T_Sale_Items;
use App\Models\T_Sales;
use App\Models\T_transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

use App\Services\Xendit\XenditService;
use Illuminate\Support\Facades\Log;

class POSRepository
{
    protected $XenditService;

    public function __construct(XenditService $XenditService)
    {
        $this->XenditService = $XenditService;
    }

    public function getAll() {

        return Product::whereHas('inventory', function ($query) {
            $query->where('isActive', InventoryStatus::Active);
        })
        ->with(['inventory' => function ($query) {
            $query->where('isActive', InventoryStatus::Active);
        }, 'unit', 'categories'])
        ->latest()
        ->paginate(10)
        ->withQueryString(); 
    }

    
    public function findById(int $id): ?T_Staff
    {
        return T_Staff::find($id);
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            /*
            |--------------------------------------------------------------------------
            | 1. Ambil user / cashier
            |--------------------------------------------------------------------------
            */

            $user = auth()->user();
            $staff = $user->staff;

            $cashierId = $staff?->id;
            $cashierName = $staff?->name ?? $user->name;

            /*
            |--------------------------------------------------------------------------
            | 2. Payment Method
            |--------------------------------------------------------------------------
            */

            $paymentMethod = $data['payment_method'] ?? 'CASH';

            /*
            |--------------------------------------------------------------------------
            | 3. Ambil semua product dari database
            |--------------------------------------------------------------------------
            */

            $productIds = collect($data['items'])
                ->pluck('product_id')
                ->unique()
                ->values();

            $products = Product::whereIn('id', $productIds)
                ->with([
                    'inventory' => function ($query) {
                        $query->where(
                            'isActive',
                            InventoryStatus::Active
                        );
                    },
                ])
                ->get()
                ->keyBy('id');

            /*
            |--------------------------------------------------------------------------
            | 4. Validasi product + inventory + stock
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;
            $items = [];

            foreach ($data['items'] as $item) {

                $product = $products->get($item['product_id']);

                if (!$product) {
                    throw new Exception(
                        "Product ID {$item['product_id']} tidak ditemukan."
                    );
                }

                $inventory = $product->inventory;

                if (!$inventory) {
                    throw new Exception(
                        "Inventory {$product->name} tidak ditemukan."
                    );
                }

                if ($inventory->qty < $item['qty']) {
                    throw new Exception(
                        "Stok {$product->name} tidak mencukupi."
                    );
                }

                $unitPrice = (float) $product->sell_price;
                $quantity = (int) $item['qty'];

                $itemSubtotal = $unitPrice * $quantity;

                $subtotal += $itemSubtotal;

                $items[] = [
                    'product' => $product,
                    'inventory' => $inventory,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $itemSubtotal,
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | 5. Hitung total
            |--------------------------------------------------------------------------
            */

            $discount = 0;

            $tax = $subtotal * 0.11;

            $grandTotal = $subtotal + $tax - $discount;

            /*
            |--------------------------------------------------------------------------
            | 6. Validasi CASH
            |--------------------------------------------------------------------------
            */

            $cashReceived = 0;
            $change = 0;

            if ($paymentMethod === 'CASH') {

                $cashReceived = (float) ($data['cash_received'] ?? 0);

                if ($cashReceived < $grandTotal) {
                    throw new Exception(
                        'Uang yang diterima tidak mencukupi.'
                    );
                }

                $change = $cashReceived - $grandTotal;
            }

            /*
            |--------------------------------------------------------------------------
            | 7. Generate invoice number
            |--------------------------------------------------------------------------
            */

            $invoiceNumber =
                'INV-' .
                now()->format('YmdHis') .
                '-' .
                strtoupper(Str::random(6));

            /*
            |--------------------------------------------------------------------------
            | 8. Create Sale
            |--------------------------------------------------------------------------
            */

            $sale = T_Sales::create([
                'invoice_number' => $invoiceNumber,
                'cashier_id' => $cashierId,
                'cashier_name' => $cashierName,
                'transaction_date' => now(),
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'grand_total' => $grandTotal,

                'status' => $paymentMethod === 'CASH'
                    ? 'completed'
                    : 'pending',
            ]);

            /*
            |--------------------------------------------------------------------------
            | 9. Create Sale Items
            |--------------------------------------------------------------------------
            */

            foreach ($items as $item) {

                T_Sale_Items::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => 0,
                    'subtotal' => $item['subtotal'],
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 10. Create Transaction
            |--------------------------------------------------------------------------
            */

            $transaction = T_transaction::create([
                'sale_id' => $sale->id,
                'transaction_type' => 'payment',

                'payment_method' => $paymentMethod,

                'amount' => $grandTotal,

                'status' => $paymentMethod === 'CASH'
                    ? 'completed'
                    : 'pending',

                'reference_number' => $invoiceNumber,

                'processed_at' => $paymentMethod === 'CASH'
                    ? now()
                    : null,
            ]);

            /*
            |--------------------------------------------------------------------------
            | 11. Xendit Invoice
            |--------------------------------------------------------------------------
            */

            // $invoiceUrl = null;
            // $xenditInvoiceId = null;
            $paymentUrl = null;
            $xenditSessionId = null;

            if ($paymentMethod === 'E-PAYMENT') {

                $store = $user->store;

                if (!$store) {
                    throw new Exception(
                        'User belum memiliki toko.'
                    );
                }

                $xenditSetting = $store->xenditSetting;

                if (!$xenditSetting) {
                    throw new Exception(
                        'Pengaturan Xendit untuk toko ini belum tersedia.'
                    );
                }

                if (!$xenditSetting->is_connected) {
                    throw new Exception(
                        'Xendit untuk toko ini belum terhubung.'
                    );
                }

                if (!$xenditSetting->api_key) {
                    throw new Exception(
                        'API Key Xendit toko belum tersedia.'
                    );
                }

                // $invoice = $this->XenditService->createPaymentSession(
                //     apiKey: $xenditSetting->api_key,
                //     payload: [
                //         'external_id' => $invoiceNumber,
                //         'amount' => $grandTotal,
                //         'payer_email' => $user->email,
                //         'description' => 'Payment ' . $invoiceNumber,
                //         'success_redirect_url' => url(
                //             '/pos/payment/success?invoice=' . $invoiceNumber
                //         ),
                //     ]
                // );

                $session = $this->XenditService->createPaymentSession(
                    apiKey: $xenditSetting->api_key,
                    payload: [
                        'reference_id' => $invoiceNumber,
                        'session_type' => 'PAY',
                        'mode' => 'COMPONENTS',
                        'amount' => $grandTotal,
                        'currency' => 'IDR',
                        'country' => 'ID',
                        'components_configuration' => [
                            'origins' => [
                                config('app.url'),
                            ],
                        ],
                        'allowed_payment_channels' => [
                            'QRIS',
                            'MANDIRI_VIRTUAL_ACCOUNT',
                            'CIMB_VIRTUAL_ACCOUNT',
                            'BSS_VIRTUAL_ACCOUNT',
                            'BSI_VIRTUAL_ACCOUNT',
                            'BRI_VIRTUAL_ACCOUNT',
                            'BNI_VIRTUAL_ACCOUNT',
                            'BCA_VIRTUAL_ACCOUNT',
                        ],
                    ]
                );

                if (!$session) {
                    throw new Exception(
                        'Gagal membuat invoice Xendit.'
                    );
                }

                // $xenditInvoiceId = $invoice['id'] ?? null;
                // $invoiceUrl = $invoice['invoice_url'] ?? null;

                 /*
                |--------------------------------------------------------------------------
                | Get Session ID
                |--------------------------------------------------------------------------
                */

                $xenditSessionId = $session['payment_session_id'] ?? null;
                $componentsSdkKey = $session['components_sdk_key'] ?? null;

                if (!$xenditSessionId) {
                    throw new Exception(
                        'Response Payment Session Xendit tidak memiliki ID.'
                    );
                }

                if (!$componentsSdkKey) {
                    throw new Exception(
                        'Response Payment Session Xendit tidak memiliki components_sdk_key.'
                    );
                }

                Log::info('Xendit Payment Session created', [
                    'session' => $session,
                ]);

                // $paymentUrl =
                //     $session['payment_link_url']
                //     ?? $session['checkout_url']
                //     ?? $session['url']
                //     ?? null;
                // $paymentUrl = $session['payment_link_url'] ?? null;

                // if (!$paymentUrl) {
                //     throw new Exception(
                //         'Response Payment Session Xendit tidak memiliki URL pembayaran.'
                //     );
                // }

                $transaction->update([
                    'reference_number' => $xenditSessionId,
                ]);

                if (!$xenditSessionId || !$componentsSdkKey) {
                    throw new Exception(
                        'Response invoice Xendit tidak lengkap.'
                    );
                }
            }

            /*
            |--------------------------------------------------------------------------
            | 11. Kurangi inventory hanya untuk CASH
            |--------------------------------------------------------------------------
            */

            if ($paymentMethod === 'CASH' || $paymentMethod === 'E-PAYMENT') {

                foreach ($items as $item) {

                    $item['inventory']->decrement(
                        'qty',
                        $item['quantity']
                    );

                    $item['inventory']->update([
                        'last_stock_out' => $item['quantity'],
                    ]);
                }
            }
            

            /*
            |--------------------------------------------------------------------------
            | 12. Return
            |--------------------------------------------------------------------------
            */

            return [
                'success' => true,
                'payment_method' => $paymentMethod,
                'sale' => $sale->fresh(),
                'transaction' => $transaction->fresh(),
                'cash_received' => $cashReceived,
                'change' => $change,
                'xendit_session_id' => $xenditSessionId,
                // 'payment_url' => $paymentUrl,
                'components_sdk_key' => $componentsSdkKey,
            ];
        });
    }

}