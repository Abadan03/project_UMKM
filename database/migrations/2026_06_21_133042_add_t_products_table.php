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
        //
        // Schema::table('t_products', function (Blueprint $table) {
        //      $table->foreignId('inventory_id')->nullable()->constrained('t_inventory')->cascadeOnUpdate()->nullOnDelete();

        //     $table->foreign('inventory_id')->references('id')->on('t_inventory')->onDelete('cascade');

        //     $table->dropColumn(['inventory_id']);
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
