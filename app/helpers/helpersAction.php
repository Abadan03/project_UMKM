<?php
use Illuminate\Support\Collection;

if (!function_exists('formatRupiah')) {
    function formatRupiah($angka)
    {
        return "Rp " . number_format($angka, 0, ',', '.');
    }
}


if (!function_exists('formatUsers')) {
    function formatUsers(Collection $users) : Collection
    {
        return $users->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'roles_id' => $item->roles_id,
                'role' => $item->roles?->name,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });
    }
}


if (!function_exists('formatStaff')) {
    function formatStaff(Collection $staff) : Collection
    {
        return $staff->map(function ($item) {
            return [
                'id' => $item->id,
                'role' => $item->roles?->name,
                'user' => $item->user,
                'name' => $item->name,
                'pin' => $item->pin,
                'roles_id' => $item->roles_id,
                'users_id' => $item->users_id,
                'roles' => $item->roles ? [
                    'id' => $item->roles->id,
                    'name' => $item->roles->name,
                ] : null,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });
    }
}
       