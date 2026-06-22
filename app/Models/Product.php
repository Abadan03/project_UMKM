<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    use HasFactory;

    protected $table = 't_products';

    protected $fillable = [
        'name',
        'qty',
        'pricing',
        'unit_id',
        'description',
    ];

    public function unit()
    {
        return $this->belongsTo(T_Units::class, 'unit_id', 'id');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'prdocuts_id');
    }
}
