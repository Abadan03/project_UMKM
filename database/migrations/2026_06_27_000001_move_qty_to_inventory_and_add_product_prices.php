<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('t_inventory', function (Blueprint $table) {
            $table->unsignedBigInteger('qty')->default(0)->after('products_id');
        });

        Schema::table('t_products', function (Blueprint $table) {
            $table->unsignedBigInteger('cost_price')->default(0)->after('unit_id');
            $table->unsignedBigInteger('sell_price')->default(0)->after('cost_price');
        });

        DB::table('t_products')
            ->select(['id', 'qty', 'pricing'])
            ->orderBy('id')
            ->chunkById(100, function ($products) {
                foreach ($products as $product) {
                    DB::table('t_products')
                        ->where('id', $product->id)
                        ->update([
                            'sell_price' => $product->pricing ?? 0,
                        ]);

                    $inventory = DB::table('t_inventory')
                        ->where('products_id', $product->id)
                        ->first();

                    if ($inventory) {
                        DB::table('t_inventory')
                            ->where('id', $inventory->id)
                            ->update([
                                'qty' => $product->qty ?? 0,
                            ]);
                    } else {
                        DB::table('t_inventory')->insert([
                            'products_id' => $product->id,
                            'isActive' => 'YES',
                            'qty' => $product->qty ?? 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            });

        Schema::table('t_products', function (Blueprint $table) {
            $table->dropColumn(['qty', 'pricing']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_products', function (Blueprint $table) {
            $table->unsignedBigInteger('qty')->default(0)->after('name');
            $table->unsignedBigInteger('pricing')->default(0)->after('qty');
        });

        DB::table('t_inventory')
            ->select(['id', 'products_id', 'qty'])
            ->orderBy('id')
            ->chunkById(100, function ($inventories) {
                foreach ($inventories as $inventory) {
                    DB::table('t_products')
                        ->where('id', $inventory->products_id)
                        ->update([
                            'qty' => $inventory->qty ?? 0,
                        ]);
                }
            });

        DB::table('t_products')
            ->select(['id', 'sell_price'])
            ->orderBy('id')
            ->chunkById(100, function ($products) {
                foreach ($products as $product) {
                    DB::table('t_products')
                        ->where('id', $product->id)
                        ->update([
                            'pricing' => $product->sell_price ?? 0,
                        ]);
                }
            });

        Schema::table('t_products', function (Blueprint $table) {
            $table->dropColumn(['cost_price', 'sell_price']);
        });

        Schema::table('t_inventory', function (Blueprint $table) {
            $table->dropColumn('qty');
        });
    }
};
