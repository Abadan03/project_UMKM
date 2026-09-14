<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\CreateSalesRequest;
use App\Models\Product;
use App\Models\T_Sales;
use App\Services\Sales\SalesServices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    protected SalesServices $salesService;

    public function __construct(SalesServices $salesService)
    {
        $this->salesService = $salesService;
    }

    public function index()
    {
        $sales = T_Sales::with('items.product', 'transactions')
            ->latest()
            ->paginate(10)
            ->withQueryString(
            );

        return Inertia::render('sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function search(Request $request)
    {
        $sales = $this->salesService->search(
            $request->all()
        );

        return Inertia::render('sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function store(
        CreateSalesRequest $request,
    ) {
        $sales = $this->salesService->create($request->validated());


        return redirect()->route('user.sales.index');
    }

    // public function create()
    // {
    //     $sales = $this->salesService->create();
    //     return Inertia::render('Sales/Sales');
    // }
}
