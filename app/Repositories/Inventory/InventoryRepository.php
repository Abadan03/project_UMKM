<?php

namespace App\Repositories\Inventory;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\T_Logs;
use App\Models\T_Modules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class InventoryRepository
{
    // formater product logs in inventory
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

    // set desc into t_logs modules inventory
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

    public function getAll(?int $productId = null)
    {
        return Inventory::with('product.unit')
            ->when($productId, function ($query) use ($productId) {
                $query->where('products_id', $productId);
            })
            ->paginate(10);
    }

    public function getLogs(?int $productId = null)
    {

        $logs = T_Logs::with('module', 'user')
            ->whereHas('module', function ($query) {
                $query->where('name', 'Product');
            })
            ->when($productId, function ($query) use ($productId) {
                $query->where('references_id', $productId);
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return $this->attachProductsToLogs($logs);
    }

    public function viewLogs(int $id)
    {
        $logs = T_Logs::with('module', 'user')
            ->whereHas('module', function ($query) {
                $query->where('name', 'Product');
            })
            ->where('references_id', $id)
            ->paginate(10);

        return $this->attachProductsToLogs($logs);
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

    public function getLowStock()
    {
        return Inventory::with("product")
            ->whereColumn('qty', '<=', 'minimum_stock')
            ->paginate(10);
    }
}