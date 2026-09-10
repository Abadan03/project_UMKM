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
        Schema::create('t_staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('pin');
            $table->foreignId('roles_id')
                ->constrained('t_roles')
                ->cascadeOnDelete();

            $table->foreignId('users_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();

            #
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_staff');
    }
};
