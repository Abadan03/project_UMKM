<?php

namespace App\Services\Products;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\T_Logs;
use App\Models\T_Modules;
use App\Models\T_Units;
use DB;
use Illuminate\Support\Collection;

class ProductService
{
    /**
     * Get all products.
     */
    public function all()
    {
        return $this->formatProducts(
            Product::with(['unit', 'inventory'])
                ->latest()
                ->get()
        );
    }

    /**
     * Search products by keyword.
     */
    public function find(?string $search)
    {
        $keyword = trim((string) $search);

        if ($keyword === '') {
            return collect();
        }

        $like = '%' . addcslashes($keyword, '\%_') . '%';

        return $this->formatProducts(
            Product::with(['unit', 'inventory'])
                ->where(function ($query) use ($like) {
                    $query->where('name', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('cost_price', 'like', $like)
                        ->orWhere('sell_price', 'like', $like)
                        ->orWhereHas('inventory', function ($inventoryQuery) use ($like) {
                            $inventoryQuery->where('qty', 'like', $like);
                        })
                        ->orWhereHas('unit', function ($unitQuery) use ($like) {
                            $unitQuery->where('name', 'like', $like)
                                ->orWhere('code', 'like', $like);
                        });
                })
                ->latest()
                ->limit(25)
                ->get()
        );
    }

    private function formatProducts(Collection $products): Collection
    {
        return $products->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'qty' => $item->inventory?->qty ?? 0,
                'inventory' => $item->inventory,
                'unit_id' => $item->unit_id,
                'unit' => $item->unit,
                'unit_code' => $item->unit?->code,
                'unit_name' => $item->unit?->name,
                'cost_price' => $item->cost_price,
                'sell_price' => $item->sell_price,
                'description' => $item->description ?? "-",
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });
    }

    /**
     * Save a new product to the database.
     */
    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {

            $qty = $data['qty'] ?? 0;
            unset($data['qty']);

            $product = Product::create($data);

            Inventory::create([
                'products_id' => $product->id,
                'isActive' => 'YES',
                'qty' => $qty,
                'minimum_stock' => $qty,
                'last_stock_in' => $qty,
                'last_stock_out' => 0,
            ]);

            $module = T_Modules::firstOrCreate([
                'name' => 'Product',
            ]);

            T_Logs::create([
                'module_id' => $module->id,
                'user_id' => auth()->id(),
                'references_id' => $product->id,
                'old_value' => 0,
                'new_value' => $qty,
                'description' => 'Initial stock.',
            ]);

            return $product->fresh('inventory');
        });
    }

    public function unitCreate(array $data): T_Units
    {
        return T_Units::create($data);
    }

    /**
     * Update an existing product.
     */
    public function update(int $id, array $data): ?Product
    {
        $product = Product::with('inventory')->find($id);

        if (!$product) {
            return null;
        }

        return DB::transaction(function () use ($product, $data) {

            $qty = $data['qty'];

            $oldQty = $product->inventory->qty;
            $oldCostPrice = $product->cost_price;

            if ($oldCostPrice != $data['cost_price']) {

                $oldHPP = $oldCostPrice * $oldQty;
                $newHPP = $data['cost_price'] * $qty;

                $newStock = $oldQty + $qty;

                $data['cost_price'] = ($oldHPP + $newHPP) / $newStock;
            }

            $product->update($data);

            $inventory = $product->inventory;

            $stockDiff = $qty - $oldQty;

            $inventory->update([
                'qty' => $qty,
                'isActive' => 'YES',
                'last_stock_in' => $stockDiff > 0 ? $stockDiff : $inventory->last_stock_in,
                'last_stock_out' => $stockDiff < 0 ? abs($stockDiff) : $inventory->last_stock_out,
            ]);

            $module = T_Modules::firstOrCreate([
                'name' => 'Product',
            ]);

            T_Logs::create([
                'module_id' => $module->id,
                'user_id' => auth()->id(),
                'references_id' => $product->id,
                'old_value' => $oldQty,
                'new_value' => $qty,
                'description' => $stockDiff > 0
                    ? "Stock added ({$stockDiff})"
                    : "Stock reduced (" . abs($stockDiff) . ")",
                'old_hpp' => $oldCostPrice
            ]);

            return $product->fresh(['inventory', 'unit']);
        });
    }

    /**
     * Delete a product.
     */
    public function delete(int $id): bool
    {
        $product = Product::find($id);

        $module = T_Modules::firstOrCreate([
            'name' => 'Product',
        ]);

        if (!$product) {
            return false;
        }

        $productDeleted = $product->delete();

        if ($productDeleted) {
            T_Logs::where('module_id', $module->id)
                ->where('references_id', $id)
                ->delete();
        }

        return (bool) $productDeleted;
    }

    public function unitDelete(string $id): bool
    {
        $units = T_Units::find($id);

        if (!$units) {
            return false;
        }

        return (bool) $units->delete();
    }
}
