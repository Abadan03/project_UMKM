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

            $table->string('invoice_id')->unique();

            // next migration will add foreign key for cashier_id (user)
            // $table->foreignId('cashier_id')
            //     ->constrained('users')
            //     ->restrictOnDelete();

            $table->timestamp('transaction_date');

            $table->decimal('subtotal', 15, 2);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('total', 15, 2);

            $table->string('payment_method');
            $table->string('payment_status');

            $table->string('status')->default('completed');

            $table->timestamps();

            $table->index('transaction_date');
            $table->index('payment_method');
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
