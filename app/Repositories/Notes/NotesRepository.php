<?php

namespace App\Repositories\Notes;

use App\Models\Inventory;
use App\Models\T_Sales;
use App\Models\User;

use App\Models\T_Staff;
use App\Repositories\Inventory\InventoryRepository;
use App\Repositories\Sales\SalesRepository;

class NotesRepository
{
    protected $InventoryRepository, $SalesRepository;

    public function __construct(InventoryRepository $InventoryRepository, SalesRepository $SalesRepository)
    {
        $this->InventoryRepository = $InventoryRepository;
        $this->SalesRepository = $SalesRepository;
    }



    public function getAll(): array
    {
        $sales = $this->SalesRepository->getSalesNotes();

        $product = $this->InventoryRepository->getLowStock();

        return [
            'sales' => $sales,
            'product' => $product,
        ];
    }

}