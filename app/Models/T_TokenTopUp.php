<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class T_TokenTopUp extends Model
{
    //
    protected $table = 't_token_topups';
    protected $fillable = [
        'user_id',
        'order_id',
        'tokens',
        'amount',
        'snap_token',
        'status',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'tokens' => 'integer',
            'amount' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
