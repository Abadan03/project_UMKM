<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\T_Units;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil unit yang sudah tersedia
        $pcs = T_Units::where('code', 'PCS')->first();
        $box = T_Units::where('code', 'BOX')->first();

        if (!$pcs || !$box) {
            $this->command->error(
                'Unit PCS atau BOX belum tersedia. Jalankan UnitSeeder terlebih dahulu.'
            );

            return;
        }

        // Product 1
        $product1 = Product::create([
            'name' => 'Kopi Hitam',
            'unit_id' => $pcs->id,
            'cost_price' => 12000,
            'sell_price' => 18000,
            'description' => 'Kopi hitam original.',
        ]);

        Inventory::create([
            'products_id' => $product1->id,
            'isActive' => true,
            'qty' => 50,
            'minimum_stock' => 10,
            'last_stock_in' => now(),
            'last_stock_out' => null,
        ]);

        // Product 2
        $product2 = Product::create([
            'name' => 'Es Teh Manis',
            'unit_id' => $pcs->id,
            'cost_price' => 5000,
            'sell_price' => 10000,
            'description' => 'Es teh manis segar.',
        ]);

        Inventory::create([
            'products_id' => $product2->id,
            'isActive' => true,
            'qty' => 100,
            'minimum_stock' => 20,
            'last_stock_in' => now(),
            'last_stock_out' => null,
        ]);

        // Product 3
        $product3 = Product::create([
            'name' => 'Roti Coklat',
            'unit_id' => $pcs->id,
            'cost_price' => 7000,
            'sell_price' => 12000,
            'description' => 'Roti dengan isian coklat.',
        ]);

        Inventory::create([
            'products_id' => $product3->id,
            'isActive' => true,
            'qty' => 30,
            'minimum_stock' => 10,
            'last_stock_in' => now(),
            'last_stock_out' => null,
        ]);

        // Product 4
        $product4 = Product::create([
            'name' => 'Air Mineral',
            'unit_id' => $box->id,
            'cost_price' => 30000,
            'sell_price' => 45000,
            'description' => 'Air mineral kemasan.',
        ]);

        Inventory::create([
            'products_id' => $product4->id,
            'isActive' => true,
            'qty' => 15,
            'minimum_stock' => 5,
            'last_stock_in' => now(),
            'last_stock_out' => null,
        ]);

        $this->command->info('Products and inventories seeded successfully.');
    }
}