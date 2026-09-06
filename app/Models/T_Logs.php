<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class T_Logs extends Model
{
    use HasUuids;

    protected $table = 't_logs';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'module_id',
        'user_id',
        'references_id',
        'old_value',
        'new_value',
        'description',
        'old_hpp'
    ];

    public function module()
    {
        return $this->belongsTo(T_Modules::class, 'module_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
