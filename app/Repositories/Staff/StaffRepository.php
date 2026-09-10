<?php

namespace App\Repositories\Staff;

use App\Models\User;
use App\Models\T_Staff;

class StaffRepository
{
    public function findById(int $id): ?T_Staff
    {
        return T_Staff::find($id);
    }

    public function update(T_Staff $staff, array $data): bool
    {
        return $staff->update($data);
    }

    public function delete(int $id): bool
    {
        $staff = T_Staff::findOrFail($id); // Ensure the staff exists before attempting to delete
        return $staff->delete();
    }

    public function create(array $data): T_Staff
    {
        return T_Staff::create($data);
    }
}