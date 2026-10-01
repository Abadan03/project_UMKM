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
        Schema::create('t_xendit_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('t_stores')->cascadeOnDelete();
            $table->enum('environment', ['sandbox', 'live'])->default('sandbox');
            $table->text('api_key')->nullable(); // di-cast 'encrypted' di Model
            $table->text('webhook_token')->nullable(); // di-cast 'encrypted' juga
            $table->boolean('is_connected')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_xendit_settings');
    }
};
