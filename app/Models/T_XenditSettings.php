<?php

namespace App\Models;

use App\Enums\XenditSettings\XenditEnvironment;
use Illuminate\Database\Eloquent\Model;

class T_XenditSettings extends Model
{
    //
    protected $table = 't_xendit_settings';
    protected $fillable = [
        'store_id', 
        'environment', 
        'api_key', 
        'webhook_token', 
        'is_connected'
    ];

    protected $casts = [
        'environment' => XenditEnvironment::class,
        'api_key' => 'encrypted',
        'webhook_token' => 'encrypted',
        'is_connected' => 'boolean',
    ];

    public function store()
    {
        return $this->belongsTo(T_Stores::class);
    }
}
