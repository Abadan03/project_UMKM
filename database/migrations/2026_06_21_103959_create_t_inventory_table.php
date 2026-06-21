<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_inventory', function (Blueprint $table) {
            $table->id();
            $table->enum('isActive', ['YES', 'NO']);
            $table->unsignedBigInteger('products_id');
            $table->timestamps();

            $table->foreign('products_id')->references('id')->on('t_products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_inventory');
    }
};
