<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AuthServices
{
    public function attempt(array $credentials): bool
    {
        return Auth::attempt($credentials);
    }

    public function getRedirectRoute(): string
    {
        $user = Auth::user();
        // dd($user);
        if (!$user) {
            return route('login');
        }

        // Mengambil nama role dari tabel t_roles secara aman
        $roleName = $user->roles ? $user->roles->name : null;

        return match($user->roles->name) {
           'super admin' => route('super-admin.dashboard'),
            'admin'       => route('admin.dashboard'),
            'staff'       => route('staff.dashboard'), // <-- Hapus redirect(), cukup route() saja
            default       => abort(403, 'Role tidak dikenali atau tidak memiliki akses.'),
        };
        // if($user->roles->name == 'staff') {
            
        //     return redirect()->route('staff.dashboard');
        //     return Inertia::render('Auth/Login');
        // }

        // return $user->roles->name;
        
    }

    public function logout(): void
    {
        Auth::logout();
        session()->flush();
    }
}