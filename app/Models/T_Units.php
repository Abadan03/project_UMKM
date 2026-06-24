<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class T_Units extends Model
{
    use HasUuids;

    protected $table = 't_units';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'code',
    ];

    /**
     * UUID primary key
     */
    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Relations
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'unit_id', 'id');
    }
}