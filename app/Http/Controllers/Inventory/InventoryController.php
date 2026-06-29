<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\UpdateInventoryRequest;
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

    public function index()
    {
        return Inertia::render('Inventory/Index', [
            'inventory' => $this->inventoryService->all(),
            'logs' => $this->inventoryService->getLogs()
        ]);
    }

    public function update(UpdateInventoryRequest $request, int $id)
    {
        $inventory = $this->inventoryService->update($id, $request->validated());

        if (!$inventory) {
            return redirect()->back()->with('error', 'Inventory not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Inventory updated successfully.');
    }

    public function viewLogs($id)
    {
        return $this->inventoryService->viewLogs($id);
    }
}
