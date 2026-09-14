<?php

namespace App\Services\Inventory;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\T_Logs;
use App\Models\T_Modules;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Get all Inventorys.
     */
    public function all()
    {
        return Inventory::with('product.unit')->latest()->get();
    }

    public function getLogs()
    {

        $logs = T_Logs::with('module', 'user')
            ->whereHas('module', function ($query) {
                $query->where('name', 'Product');
            })
            ->latest()
            ->get();

        return $this->attachProductsToLogs($logs);
    }

    /**
     * Find a single Inventory by id.
     */
    public function find(int $id): ?Inventory
    {
        return Inventory::find($id);
    }

    public function viewLogs(int $id)
    {
        $logs = T_Logs::with('module', 'user')
            ->whereHas('module', function ($query) {
                $query->where('name', 'Product');
            })
            ->where('references_id', $id)
            ->latest()
            ->get();

        return $this->attachProductsToLogs($logs);
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
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return null;
        }

        return DB::transaction(function () use ($inventory, $data) {
            $oldQty = $inventory->qty;
            $newQty = $data['qty'];
            $userId = $data['user_id'] ?? Auth::id();

            unset($data['user_id']);

            $stockDiff = $newQty - $oldQty;

            if ($stockDiff > 0) {
                // stok bertambah
                $data['last_stock_in'] = $stockDiff;
                $data['last_stock_out'] = $inventory->last_stock_out;
            } elseif ($stockDiff < 0) {
                // stok berkurang
                $data['last_stock_in'] = $inventory->last_stock_in;
                $data['last_stock_out'] = abs($stockDiff);
            } else {
                // tidak ada perubahan
                $data['last_stock_in'] = $inventory->last_stock_in;
                $data['last_stock_out'] = $inventory->last_stock_out;
            }

            $inventory->update($data);

            $module = T_Modules::firstOrCreate([
                'name' => 'Product',
            ]);

            T_Logs::create([
                'module_id' => $module->id,
                'user_id' => (string) $userId,
                'references_id' => $inventory->products_id,
                'old_value' => $oldQty,
                'new_value' => $newQty,
                'description' => $this->stockLogDescription($stockDiff),
            ]);

            return $inventory->fresh('product.unit');
        });
    }

    private function stockLogDescription(int $stockDiff): string
    {
        if ($stockDiff > 0) {
            return 'Inventory stock in.';
        }

        if ($stockDiff < 0) {
            return 'Inventory stock out.';
        }

        return 'Inventory product updated.';
    }

    private function attachProductsToLogs($logs)
    {
        $products = Product::whereIn(
            'id',
            $logs->pluck('references_id')
        )->get()->keyBy('id');

        $logs->each(function ($log) use ($products) {
            $log->product = $products->get($log->references_id);
        });

        return $logs;
    }

    /**
     * Delete a Inventory.
     */
    public function delete(int $id): bool
    {
        $Inventory = Inventory::find($id);

        if (!$Inventory) {
            return false;
        }

        return (bool) $Inventory->delete();
    }
}
