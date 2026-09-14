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
        Schema::create('t_sales', function (Blueprint $table) {
            $table->id();

            $table->string('invoice_number')->unique();

            $table->timestamp('transaction_date');

            $table->decimal('subtotal', 15, 2);

            $table->decimal('discount', 15, 2)
                ->default(0);

            $table->decimal('tax', 15, 2)
                ->default(0);

            $table->decimal('grand_total', 15, 2);

            $table->enum('status', [
                'pending',
                'completed',
                'cancelled',
            ])->default('pending');

            $table->text('notes')->nullable();

            $table->timestamps();

            // $table->index('cashier_id');
            $table->index('invoice_number');
            $table->index('transaction_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_sales');
    }
};
