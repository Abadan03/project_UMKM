<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('t_stores')->insert([
            'name' => "Store Test",
            'address' => "test address",
            'phone' => "081234567890",
            'currency' => "IDR",
        ]);
    }
}
