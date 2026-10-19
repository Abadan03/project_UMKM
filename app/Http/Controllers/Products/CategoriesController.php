<?php

namespace App\Http\Controllers\Products;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

// Request
use App\Http\Requests\Categories\CategoriesRequest;
use App\Http\Requests\POS\POSRequest;


// Repository
use App\Repositories\POS\POSRepository;
use App\Repositories\Categories\CategoriesRepository;

// JSONResponse
use Illuminate\Http\JsonResponse;


class CategoriesController extends Controller
{
    //

    protected $CategoriesRepository;
    protected $POSRepository;

    public function __construct(CategoriesRepository $CategoriesRepository, POSRepository $POSRepository)
    {
        $this->CategoriesRepository = $CategoriesRepository;
        $this->POSRepository = $POSRepository;
    }


    public function store(CategoriesRequest $request)
    {
        try {

            $result = $this->CategoriesRepository->store(
                $request->validated()
            );

            // return response()->json($result);
            return back()->with('success', 'Product created successfully.');

        } catch (\Throwable $e) {

            report($e);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
