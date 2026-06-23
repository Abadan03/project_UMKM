<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\CreateRequest;
use Illuminate\Http\Request;
use App\Models\T_Units;
use App\Services\Products\ProductService;
use Illuminate\Http\Request as HttpRequest;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        $products = $this->productService->all();
        $units = T_Units::all();

        return Inertia::render('Products/Kontol', [
            'products' => $products,
            'units' => $units
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->query('query');

        return response()->json(
            $this->productService->find($search)
        );
    }

    public function store(CreateRequest $request)
    {
        $this->productService->create($request->validated());

        return back()->with('success', 'Product created successfully.');
    }

    public function update(CreateRequest $request, int $id)
    {
        $product = $this->productService->update($id, $request->validated());

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(int $id)
    {
        $deleted = $this->productService->delete($id);

        if (!$deleted) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Product deleted successfully.');
    }
}