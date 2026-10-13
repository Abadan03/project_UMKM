<?php

namespace App\Http\Controllers\StoreManagement;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreManagement\Tax\TaxRequest;
use App\Repositories\Tax\TaxRepository;
use Inertia\Inertia;
use Throwable;

class TaxSettingsController extends Controller
{


    protected $TaxRepository;

    public function __construct(TaxRepository $TaxRepository)
    {
        $this->TaxRepository = $TaxRepository;
    }
    //
    public function index() {

        $getTaxSettings = $this->TaxRepository->getTaxSettings();

        return Inertia::render('StoreManagement/TaxSettings/Index', [
            'taxSetting' => $getTaxSettings
        ]);
    }

    public function update(TaxRequest $request) {    
       try {
         $validated = $request->validated();

         $result = $this->TaxRepository->store($validated);



        return redirect()->back()->with('success', 'Tax settings Saved successfully.');
        // return response()->json($result);
       } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => 'Failed to save tax settings: ' . $e->getMessage()]);
       }
    }
}
