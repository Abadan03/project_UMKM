<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\CreateRequest;
use Illuminate\Http\Request;
use App\Models\T_Units;
use App\Repositories\Products\ProductRepository;
use App\Repositories\Products\UnitRepository;
use Inertia\Inertia;

// Repository
use App\Repositories\Product\CategoriesRepository;

class ProductController extends Controller
{
    protected ProductRepository $ProductRepository;
    protected CategoriesRepository $CategoriesRepository;

    public function __construct(ProductRepository $ProductRepository, CategoriesRepository $CategoriesRepository)
    {
        $this->ProductRepository = $ProductRepository;
        $this->CategoriesRepository = $CategoriesRepository;
    }

    public function index()
    {
        $products = $this->ProductRepository->getAll();
        $units = T_Units::all();

        $getCategories = $this->CategoriesRepository->getAll();
        // dd($getCategories);


        return Inertia::render('Products/Products', [
            'products' => $products,
            'units' => $units,
            'categories' => $getCategories
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->query('query');

        return response()->json(
            $this->ProductRepository->find($search)
        );
    }

    public function store(CreateRequest $request)
    {
        $request['qty'] ?? 0;

        $this->ProductRepository->create($request->validated());

        return back()->with('success', 'Product created successfully.');
    }

    public function update(CreateRequest $request, int $id)
    {
        $product = $this->ProductRepository->update($id, $request->validated());

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(int $id)
    {
        $deleted = $this->ProductRepository->delete($id);

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