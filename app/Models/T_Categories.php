<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class T_Categories extends Model
{
    //
    use HasFactory;

    protected $table = 't_categories';

    protected $fillable = [
        'name',
        'description',
    ];

    public function product(): HasMany
    {
        return $this->HasMany(
            Product::class,
            'categories_id', 'id'
        );
    }
}
