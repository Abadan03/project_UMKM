<?php

namespace Database\Seeders;

use App\Models\T_Sales;
use App\Models\T_Sale_Items;
use App\Models\T_transaction;
use Illuminate\Database\Seeder;

class SalesSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | SALE 1
        |--------------------------------------------------------------------------
        */

        $sale1 = T_Sales::create([
            'invoice_number' => 'INV-20260910-001',
            'cashier_id' => 1,
            'cashier_name' => 'user',
            'subtotal' => 50000,
            'discount' => 0,
            'tax' => 0,
            'grand_total' => 50000,
            'transaction_date' => '2026-09-10 10:00:00',
        ]);

        T_Sale_Items::create([
            'sale_id' => $sale1->id,
            'product_id' => 1,
            'quantity' => 2,
            'unit_price' => 25000,
            'discount' => 0,
            'subtotal' => 50000,
        ]);

        T_transaction::create([
            'sale_id' => $sale1->id,
            'transaction_type' => 'payment',
            'amount' => 50000,
            'payment_method' => 'cash',
            'reference_number' => null,
            'processed_at' => '2026-09-10 10:00:00',
            'status' => 'completed',
            'notes' => 'Cash payment',
        ]);


        /*
        |--------------------------------------------------------------------------
        | SALE 2
        |--------------------------------------------------------------------------
        */

        $sale2 = T_Sales::create([
            'invoice_number' => 'INV-20260910-002',
            'cashier_id' => 1,
            'cashier_name' => 'user',
            'subtotal' => 75000,
            'discount' => 5000,
            'tax' => 7000,
            'grand_total' => 77000,
            'transaction_date' => '2026-09-10 11:30:00',
        ]);

        T_Sale_Items::create([
            'sale_id' => $sale2->id,
            'product_id' => 1,
            'quantity' => 3,
            'unit_price' => 25000,
            'discount' => 0,
            'subtotal' => 50000,
        ]);

        T_transaction::create([
            'sale_id' => $sale2->id,
            'transaction_type' => 'payment',
            'amount' => 77000,
            'payment_method' => 'bank_transfer',
            'reference_number' => 'TRX-20260910-002',
            'processed_at' => '2026-09-10 11:30:00',
            'status' => 'completed',
            'notes' => 'Bank transfer payment',
        ]);


        /*
        |--------------------------------------------------------------------------
        | SALE 3 - PRODUCT 1 + PRODUCT 2
        |--------------------------------------------------------------------------
        */

        $sale3 = T_Sales::create([
            'invoice_number' => 'INV-20260910-003',
            'cashier_id' => 1,
            'cashier_name' => 'user',
            'subtotal' => 100000,
            'discount' => 10000,
            'tax' => 9000,
            'grand_total' => 99000,
            'transaction_date' => '2026-09-10 13:00:00',
        ]);

        T_Sale_Items::create([
            'sale_id' => $sale3->id,
            'product_id' => 1,
            'quantity' => 2,
            'unit_price' => 25000,
            'discount' => 0,
            'subtotal' => 50000,
        ]);

        T_Sale_Items::create([
            'sale_id' => $sale3->id,
            'product_id' => 1,
            'quantity' => 2,
            'unit_price' => 25000,
            'discount' => 0,
            'subtotal' => 50000,
        ]);

        T_transaction::create([
            'sale_id' => $sale3->id,
            'transaction_type' => 'payment',
            'amount' => 99000,
            'payment_method' => 'e_wallet',
            'reference_number' => 'EWALLET-003',
            'processed_at' => '2026-09-10 13:00:00',
            'status' => 'completed',
            'notes' => 'E-wallet payment',
        ]);
    }
}
