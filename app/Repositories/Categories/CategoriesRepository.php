<?php
namespace App\Repositories\Categories;

use App\Models\User;
use App\Models\T_Staff;
use App\Models\Product;
use App\Models\T_Categories;

class CategoriesRepository
{

    public function getAll()
    {

        return T_Categories::with('product')
            ->latest()
            ->paginate(10);
        // ->get(); 
    }


    public function findById(int $id): ?T_Staff
    {
        return T_Staff::find($id);
    }

    public function store(array $data): ?T_Categories
    {

        try {
            return T_Categories::create($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

}