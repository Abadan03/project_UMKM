<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\CreateRequest;
use Illuminate\Http\Request;
use App\Models\T_Units;
use App\Repositories\Products\ProductRepository;
use App\Repositories\Products\UnitRepository;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductRepository $productRepository;
    protected UnitRepository $unitRepository;

    public function __construct(
        ProductRepository $productRepository,
        UnitRepository $unitRepository,
    ) {
        $this->productRepository = $productRepository;
        $this->unitRepository = $unitRepository;
    }

    public function index()
    {
        $products = $this->productRepository->getAll();
        $units = T_Units::all();

        return Inertia::render('Products/Products', [
            'products' => $products,
            'units' => $units,
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->query('query');

        return response()->json(
            $this->productRepository->find($search)
        );
    }

    public function store(CreateRequest $request)
    {
        $request['qty'] ?? 0;

        $this->productRepository->create($request->validated());

        return back()->with('success', 'Product created successfully.');
    }

    public function update(CreateRequest $request, int $id)
    {
        $product = $this->productRepository->update($id, $request->validated());

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(int $id)
    {
        $deleted = $this->productRepository->delete($id);

        if (!$deleted) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Product deleted successfully.');
    }

    public function unitStore(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required'],
            'code' => ['required', 'unique:t_units,code'],
        ]);

        $this->unitRepository->unitCreate($validated);

        return back()->with('success', 'Product created successfully.');
    }
    public function unitDestroy(string $id)
    {
        $deleted = $this->unitRepository->unitDelete($id);

        if (!$deleted) {
            return redirect()->back()->with('error', 'Unit not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Unit deleted successfully.');
    }
}