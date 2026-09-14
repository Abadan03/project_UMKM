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
        Schema::create('t_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sale_id')
                ->constrained('t_sales')
                ->cascadeOnDelete();

            $table->enum('transaction_type', [
                'payment',
                'refund',
                'void',
                'chargeback',
            ]);

            $table->string('payment_method');

            $table->decimal('amount', 15, 2);

            $table->enum('status', [
                'pending',
                'completed',
                'failed',
                'cancelled',
            ])->default('pending');

            $table->string('reference_number')
                ->nullable()
                ->unique();

            $table->timestamp('processed_at')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->index('sale_id');
            $table->index('transaction_type');
            $table->index('payment_method');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_transaction');
    }
};
