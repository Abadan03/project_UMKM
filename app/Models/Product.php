<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    //
    use HasFactory;

    protected $table = 't_products';

    protected $fillable = [
        'name',
        'unit_id',
        'cost_price',
        'sell_price',
        'description',
        'categories_id'
    ];

    public function unit()
    {
        return $this->belongsTo(T_Units::class, 'unit_id', 'id');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'products_id');
    }
    public function salesItem(): HasOne
    {
        return $this->HasOne(
            T_Sale_Items::class,
            'product_id'
        );
    }

    public function categories(): BelongsTo 
    {
        return $this->BelongsTo(T_Categories::class, 'categories_id', 'id');
    }
}
