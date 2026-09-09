<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\T_Sales;
use App\Services\Sales\SalesServices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function __construct(
        protected SalesServices $salesService
    ) {
    }
    public function index()
    {
        $sales = T_Sales::latest()
            ->paginate(10)
            ->withQueryString(
            );

        return Inertia::render('sales/Sales', [
            'sales' => $sales,
        ]);
    }

    public function search(Request $request)
    {
        $sales = $this->salesService->search(
            $request->all()
        );

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
        ]);
    }
}
