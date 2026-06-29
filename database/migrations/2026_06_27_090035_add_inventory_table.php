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
        Schema::table('t_inventory', function (Blueprint $table) {
            $table->unsignedBigInteger('minimum_stock');
            $table->unsignedBigInteger('last_stock_in');
            $table->unsignedBigInteger('last_stock_out');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
