<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class T_Sales extends Model
{
    use HasFactory;

    protected $table = 't_sales';

    protected $fillable = [
        'invoice_number',
        'cashier_id',
        'cashier_name',
        'transaction_date',
        'subtotal',
        'discount',
        'tax',
        'grand_total',
        'payment_method',
        'payment_status',
        'status',
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(
            T_Sale_Items::class,
            'sale_id'
        );
    }

    public function transactions(): HasMany
    {
        return $this->HasMany(
            T_transaction::class,
            'sale_id'
        );
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(
            T_Staff::class,
            'cashier_id'
        );
    }
}
