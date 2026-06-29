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
        Schema::create('t_logs', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid('module_id');
            $table->string('user_id', 32);
            $table->unsignedBigInteger("references_id");
            $table->unsignedInteger("old_value")->nullable();
            $table->unsignedInteger("new_value")->nullable();
            $table->string("description");
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_logs');
    }
};
