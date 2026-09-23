<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\UpdateInventoryRequest;
use App\Repositories\Inventory\InventoryRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    //
    protected InventoryRepository $inventoryRepository;

    public function __construct(InventoryRepository $inventoryRepository)
    {
        $this->inventoryRepository = $inventoryRepository;
    }

    public function index(Request $request)
    {
        $productId = $request->integer('product_id') ?: null;

        return Inertia::render('Inventory/Index', [
            'inventory' => $this->inventoryRepository->getAll($productId),
            'logs' => $this->inventoryRepository->getLogs($productId),
        ]);
    }

    public function update(UpdateInventoryRequest $request, int $id)
    {
        $inventory = $this->inventoryRepository->update($id, $request->validated());

        if (!$inventory) {
            return redirect()->back()->with('error', 'Inventory not found.');
        }

        return redirect()
            ->back()
            ->with('success', 'Inventory updated successfully.');
    }

    public function logs()
    {
        return $this->inventoryRepository->getLogs();
    }

    public function viewLogs($id)
    {
        return $this->inventoryRepository->viewLogs($id);
    }
}
