<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    //
    use HasFactory;

    protected $table = 't_inventory';
    // protected $with = 't_products';

    protected $fillable = [
        'products_id',
        'isActive',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id');
    }
}
