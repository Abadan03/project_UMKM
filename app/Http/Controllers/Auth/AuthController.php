<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthServices;
// use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(private AuthServices $authService) {}
     public function index()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(LoginRequest $request)
    {
        if (!$this->authService->attempt($request->only('email', 'password'))) {
            $response = 'Kredensial tidak valid';
            return response()->json($response);
        }

        $request->session()->regenerate();

        // if(Auth()->user->roles == 'staff') {
        //     return redirect()->route('staff.dashboard');
        // }

        $user = Auth::user();
        // dd($user);

        // 5. Pengondisian Redirect berdasarkan Role
        // Sesuaikan nama 'roles->name' dengan nama relasi & kolom di database kamu
        // if ($user->roles && $user->roles->name === 'super_admin') {
        //     return redirect()->route('super-admin.dashboard');
        // }

        // if ($user->roles && $user->roles->name === 'admin') {
        //     return redirect()->route('admin.dashboard');
        // }

        // if ($user->roles && $user->roles->name === 'staff') {
        //     return redirect()->route('staff.dashboard');
        // }

        return redirect($this->authService->getRedirectRoute());
    }

    public function logout(Request $request)
    {
        $this->authService->logout();
        // $request->invalidate();
        return redirect()->route('login');
    }
}
