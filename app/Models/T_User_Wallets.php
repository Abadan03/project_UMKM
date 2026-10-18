<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class T_User_Wallets extends Model
{
    //
    protected $table = "t_user_wallets";
    protected $fillable = ["user_id", "balance"];

    protected function casts(): array
    {
        return [
            "balance" => "integer",
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
