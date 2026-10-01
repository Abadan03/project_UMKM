<?php

namespace App\Enums\Inventory;

enum InventoryStatus: string
{
    case Active = 'YES';
    case Inactive = 'NO';

    public function label(): string
    {
        return match($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
        };
    }
}