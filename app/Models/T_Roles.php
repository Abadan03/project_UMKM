<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class T_Roles extends Model
{
    //
    protected $table = 't_roles';
    use HasFactory, Notifiable;

    protected $guarded = [
        'id',
        'name'
    ];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
