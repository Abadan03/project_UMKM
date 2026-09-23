<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\CreateSalesRequest;
use App\Repositories\Sales\SalesRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    protected SalesRepository $salesRepository;

    public function __construct(SalesRepository $salesRepository)
    {
        $this->salesRepository = $salesRepository;
    }

    public function index()
    {
        $sales = $this->salesRepository->getAll();

        return Inertia::render('sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function search(Request $request)
    {
        $sales = $this->salesRepository->search(
            $request->all()
        );

        return Inertia::render('sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function store(
        CreateSalesRequest $request,
    ) {
        $this->salesRepository->create($request->validated());


        return redirect()->route('user.sales.index');
    }

}
