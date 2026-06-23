<?php

namespace App\Services\Products;

use App\Models\Inventory;
use App\Models\Product;
use Request;

class ProductService
{
    /**
     * Get all products.
     */
    public function all()
    {
        return Product::with('unit')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'qty' => $item->qty,
                'unit_id' => $item->unit_id,
                'unit_code' => $item->unit->code,
                'unit_name' => $item->unit->name,
                'pricing' => $item->pricing,
                'description' => $item->description,
                'created_at' => $item->created_at
            ];
        });
    }

    /**
     * Find a single product by id.
     */
    public function find(?string $search)
    {
        return Product::with('unit')
            ->where('name', 'like', "%{$search}%")
            ->get();
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
}