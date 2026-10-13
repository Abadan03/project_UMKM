<?php

namespace App\Repositories\Tax;

use App\Enums\TaxSettings\TaxStatus;
use App\Models\User;
use App\Models\T_Staff;
use App\Models\T_TaxSettings;
use Illuminate\Support\Facades\DB;

class TaxRepository
{

    public function getTaxSettings()
    {
        $storeId = auth()->user()->store_id;

        return T_TaxSettings::where(['store_id' => $storeId, 'is_active' => TaxStatus::Active])->first();
    }

    public function store(array $data)
    {

        $getStoreID = auth()->user()->store_id;
        // dd($getStoreID);
    //     name: taxSetting?.name ?? 'PPN',
    //   percentage: taxSetting?.percentage ?? 11,
    //   is_active: taxSetting?.is_active ?? true,
    //   is_inclusive: taxSetting?.is_inclusive ?? false,

        try {
            return DB::transaction(function () use ($data, $getStoreID) {

                $tax = T_TaxSettings::updateOrCreate(
                    ['store_id' => $getStoreID],
                    [
                        'name'        => $data['name'],
                        'percentage'  => $data['percentage'],
                        'isActive'    => $data['is_active'],
                        'isInclusive' => $data['is_inclusive'],
                    ]
                );
                return $tax;
            });
        } catch (\Exception $e) {
            // Handle the exception, e.g., log it or rethrow it
            throw $e;
        }
        
    }

}