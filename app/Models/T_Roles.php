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
        return $this->hasMany(User::class, 'roles_id');
    }

    public function hasRole(array $roles): bool
    {
        return $this->roles()
            ->whereIn('name', $roles)
            ->exists();
    }
}
