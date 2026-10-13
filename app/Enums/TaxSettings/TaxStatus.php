<?php

namespace App\Enums\TaxSettings;

enum TaxStatus: int
{
    case Active = 1;
    case Inactive = 0;

    public function label(): string
    {
        return match($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
        };
    }
}