<?php

namespace App\Services\Inventory;

use App\Models\Inventory;
use App\Models\Product;

class InventoryService
{
    /**
     * Get all Inventorys.
     */
    public function all()
    {
        return Inventory::all();
    }

    /**
     * Find a single Inventory by id.
     */
    public function find(int $id): ?Inventory
    {
        return Inventory::find($id);
    }

    /**
     * Save a new Inventory to the database.
     */
    public function create(array $data): Inventory
    {
        return Inventory::create($data);
    }

    /**
     * Update an existing Inventory.
     */
    public function update(int $id, array $data): ?Inventory
    {
        $Inventory = Inventory::find($id);

        if (! $Inventory) {
            return null;
        }

        $Inventory->update($data);

        return $Inventory;
    }

    /**
     * Delete a Inventory.
     */
    public function delete(int $id): bool
    {
        $Inventory = Inventory::find($id);

        if (! $Inventory) {
            return false;
        }

        return (bool) $Inventory->delete();
    }
}