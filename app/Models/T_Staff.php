<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class T_Staff extends Model
{
    //
    use HasFactory;

    protected $table = 't_staff';

    protected $fillable = [
        'name',
        'pin',
        'roles_id',
        'users_id',
    ];

    public function roles(): BelongsTo
    {
        return $this->belongsTo(
            T_Roles::class,
            'roles_id',
            'id'
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'users_id'
        );
    }

}
