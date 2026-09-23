<?php

namespace App\Repositories\Products;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\T_Logs;
use App\Models\T_Modules;
use App\Models\T_Units;
use DB;

class UnitRepository
{

    public function getAll()
    {
        return formatProducts(
            Product::with(['unit', 'inventory'])
                ->latest()
                ->get()
        );
    }

    public function unitCreate(array $data): T_Units
    {
        return T_Units::create($data);
    }



    /**
     * Delete a product.
     */
    public function unitDelete(string $id): bool
    {
        $units = T_Units::find($id);

        if (!$units) {
            return false;
        }

        return (bool) $units->delete();
    }

}