<?php

namespace App\Services\Products;

use App\Models\Product;

class ProductService
{
    /**
     * Get all products.
     */
    public function all()
    {
        return Product::get();
    }

    /**
     * Find a single product by id.
     */
    public function find(int $id): ?Product
    {
        return Product::find($id);
    }

    /**
     * Save a new product to the database.
     */
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    /**
     * Update an existing product.
     */
    public function update(int $id, array $data): ?Product
    {
        $product = Product::find($id);

        if (! $product) {
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

        if (! $product) {
            return false;
        }

        return (bool) $product->delete();
    }
}