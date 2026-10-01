<?php 
namespace App\Services\POS;

use Illuminate\Support\Collection;
use DB;

class POSService 
{

    private function formatPOS(Collection $products): Collection
    {
        return $products->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description
            ];
        });
    }

}