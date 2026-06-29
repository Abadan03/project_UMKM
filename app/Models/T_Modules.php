<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class T_Modules extends Model
{
    use HasUuids;

    protected $table = 't_modules';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
    ];

    public function logs()
    {
        return $this->hasMany(T_Logs::class, 'module_id', 'id');
    }
}
