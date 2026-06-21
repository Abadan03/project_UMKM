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
        'description',
    ];

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'prdocuts_id');
    }
}
