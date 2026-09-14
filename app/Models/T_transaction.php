<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class T_transaction extends Model
{
    use HasFactory;

    protected $table = 't_transactions';

    protected $fillable = [
        'sale_id',
        'transaction_type',
        'amount',
        'payment_method',
        'reference_number', // get the reference number from the payment gateway response
        'processed_at',
        'status', // pending completed failed canceled
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function sales(): BelongsTo
    {
        return $this->BelongsTo(
            T_Sales::class,
            'sale_id'
        );
    }

}
