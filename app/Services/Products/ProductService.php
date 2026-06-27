<?php

namespace App\Services\Products;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\T_Units;
use Illuminate\Support\Collection;

class ProductService
{
    /**
     * Get all products.
     */
    public function all()
    {
        return $this->formatProducts(
            Product::with('unit')
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
            Product::with('unit')
                ->where(function ($query) use ($like) {
                    $query->where('name', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('qty', 'like', $like)
                        ->orWhere('pricing', 'like', $like)
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
                'qty' => $item->qty,
                'unit_id' => $item->unit_id,
                'unit' => $item->unit,
                'unit_code' => $item->unit?->code,
                'unit_name' => $item->unit?->name,
                'pricing' => $item->pricing,
                'description' => $item->description,
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

        // 1. Buat produk baru
        // dd($data);
        $product = Product::create($data);

        // 2. Buat instance Inventory baru
        Inventory::create([
            'products_id' => $product->id,
            'isActive' => 'YES',
        ]);

        return $product;
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
        $product = Product::find($id);

        if (!$product) {
            return null;
        }

        $product->update($data);

        return $product;
    }

    /**
     * Delete a product.
     */
    public function delete(int $id): bool
    {
        $product = Product::find($id);

        if (!$product) {
            return false;
        }

        return (bool) $product->delete();
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
