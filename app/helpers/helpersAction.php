<?php
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

if (!function_exists('formatRupiah')) {
    function formatRupiah($angka)
    {
        return "Rp " . number_format($angka, 0, ',', '.');
    }
}


if (!function_exists('formatUsers')) {
    function formatUsers(Collection|LengthAwarePaginator $users): Collection|LengthAwarePaginator
    {
        $formatter = function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'roles_id' => $item->roles_id,
                'role' => $item->roles?->name,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        };

        if ($users instanceof LengthAwarePaginator) {
            $users->setCollection($users->getCollection()->map($formatter));

            return $users;
        }

        return $users->map($formatter);
    }
}

if (!function_exists('formatProducts')) {
    function formatProducts(Collection|LengthAwarePaginator $products): Collection|LengthAwarePaginator
    {
        $formatter = function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'qty' => $item->inventory?->qty ?? 0,
                'inventory' => $item->inventory,
                'unit_id' => $item->unit_id,
                'unit' => $item->unit,
                'unit_code' => $item->unit?->code,
                'unit_name' => $item->unit?->name,
                'cost_price' => $item->cost_price,
                'sell_price' => $item->sell_price,
                'description' => $item->description ?? "-",
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        };

        if ($products instanceof LengthAwarePaginator) {
            $products->setCollection($products->getCollection()->map($formatter));

            return $products;
        }

        return $products->map($formatter);
    }
}


if (!function_exists('formatStaff')) {
    function formatStaff(Collection|LengthAwarePaginator $staff): Collection|LengthAwarePaginator
    {
        $formatter = function ($item) {
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
        };

        if ($staff instanceof LengthAwarePaginator) {
            $staff->setCollection($staff->getCollection()->map($formatter));

            return $staff;
        }

        return $staff->map($formatter);
    }
}
