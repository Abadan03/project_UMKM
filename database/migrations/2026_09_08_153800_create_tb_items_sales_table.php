<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_items_sales', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sale_id')
                ->constrained('t_sales')
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->constrained('t_products')
                ->restrictOnDelete();

            $table->decimal('quantity', 15, 2);

            $table->decimal('price', 15, 2);

            $table->decimal('discount', 15, 2)->default(0);

            $table->decimal('subtotal', 15, 2);

            $table->timestamps();

            $table->index('sale_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_items_sales');
    }
};
