<?php

namespace Database\Seeders;

use App\Models\T_Units;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'name' => 'Pieces',
                'code' => 'PCS',
            ],
            [
                'name' => 'Pack',
                'code' => 'PACK',
            ],
            [
                'name' => 'Box',
                'code' => 'BOX',
            ],
            [
                'name' => 'Kilogram',
                'code' => 'KG',
            ],
            [
                'name' => 'Gram',
                'code' => 'GR',
            ],
            [
                'name' => 'Liter',
                'code' => 'L',
            ],
            [
                'name' => 'Milliliter',
                'code' => 'ML',
            ],
            [
                'name' => 'Bottle',
                'code' => 'BTL',
            ],
            [
                'name' => 'Cup',
                'code' => 'CUP',
            ],
            [
                'name' => 'Portion',
                'code' => 'PORSI',
            ],
        ];

        foreach ($units as $unit) {
            T_Units::updateOrCreate(
                ['code' => $unit['code']],
                $unit
            );
        }
    }
}