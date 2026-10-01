<?php

namespace App\Models;

use App\Enums\Inventory\InventoryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    //
    use HasFactory;

    protected $table = 't_inventory';

    protected $fillable = [
        'products_id',
        'isActive',
        'qty',
        'minimum_stock',
        'last_stock_in',
        'last_stock_out',
    ];

    protected $casts = [
        'isActive' => InventoryStatus::class
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id');
    }
}
