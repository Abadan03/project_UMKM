<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Stores extends Model
{
    //
    use HasFactory;

    protected $table = 't_stores';

    protected $fillable = [
        'name',
        'address',
        'phone',
        'currency',
        // 'timezone',
        'logo_path',
    ];


    public function taxSetting()
    {
        return $this->hasOne(T_TaxSettings::class, 'store_id');
    }

    public function xenditSetting()
    {
        return $this->hasOne(T_XenditSettings::class, 'store_id');
    }
}
