<?php

namespace App\Http\Controllers\Inventory;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Services\Inventory\InventoryService;
use Inertia\Inertia;

class InventoryController extends Controller
{
    //
    protected InventoryService $inventoryService;

     public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index() {
        $p = $this->inventoryService->all();

        // dd($p->first()->product);

        $inventory = Inventory::with('product')->get();

        // dd($inventory);

    
        return Inertia::render('Inventory/Index', [
            'inventory' => $inventory
        ]);
    }
}
