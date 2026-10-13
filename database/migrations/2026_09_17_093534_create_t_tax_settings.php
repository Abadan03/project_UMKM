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
        Schema::create('t_tax_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('t_stores')->cascadeOnDelete();
            $table->string('name')->default('PPN');
            $table->integer('percentage')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_inclusive')->default(false);
            $table->dateTime('effective_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_tax_settings');
    }
};
