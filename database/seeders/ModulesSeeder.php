<?php

namespace Database\Seeders;

use App\Models\T_Modules;
use Illuminate\Database\Seeder;

class ModulesSeeder extends Seeder
{
    public function run(): void
    {
        $Modules = [
            [
                'name' => 'Product',
            ],
            [
                'name' => 'Sales',
            ],
            [
                'name' => 'Finance',
            ],
        ];

        foreach ($Modules as $unit) {
            T_Modules::updateOrCreate(
                ['name' => $unit['name']]
            );
        }
    }
}
