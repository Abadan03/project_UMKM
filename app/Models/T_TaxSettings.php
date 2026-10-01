<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class T_TaxSettings extends Model
{
    //
    protected $table = 't_tax_settings';
    protected $fillable = [
        'store_id', 
        'name', 
        'percentage', 
        'is_active', 
        'is_inclusive'
    ];

    public function store()
    {
        return $this->belongsTo(T_Stores::class);
    }
}
