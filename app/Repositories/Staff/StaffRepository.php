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

    public function search(string $keyword)
    {
        $like = '%' . addcslashes($keyword, '\\%_') . '%';

        return T_Staff::with('user')
            ->where(function ($query) use ($like) {
                $query->where('name', 'like', $like)
                    ->orWhere('pin', 'like', $like)
                    ->orWhereHas('user', function ($userQuery) use ($like) {
                        $userQuery->where('name', 'like', $like);
                    });
            })
            ->paginate(10);
    }
}