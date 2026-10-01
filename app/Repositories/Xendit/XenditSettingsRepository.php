<?php

namespace App\Repositories\Xendit;

use App\Models\T_Stores;
use App\Models\T_XenditSettings;

class XenditSettingsRepository
{
    public function findByStore(T_Stores $store): ?T_XenditSettings
    {
        return $store->xenditSetting;
    }

    public function updateOrCreate(T_Stores $store, array $data): T_XenditSettings
    {
        return T_XenditSettings::updateOrCreate(
            ['store_id' => $store->id],
            $data
        );
    }
}