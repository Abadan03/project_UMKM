<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthServices;
use Illuminate\Http\Request;


// API Mobile Auth Controller

// error code [401] = Unauthorized
// error code [403] = Forbidden
// error code [404] = Not Found
// error code [500] = Internal Server Error


class AuthController extends Controller
{
    public function __construct(private AuthServices $authService)
    {
    }

    public function login(LoginRequest $request)
    {
        if (!$this->authService->attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }


        return response()->json(['message' => 'OK'], 200);
    }

    public function logout(Request $request)
    {
        $this->authService->logout();
        // $request->invalidate();
        return response()->json(['message' => 'OK'], 200);
    }
}
