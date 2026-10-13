<?php

namespace App\Http\Controllers\StoreManagement;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TokenController extends Controller
{
    public function tokenSettings()
    {
        return Inertia::render('StoreManagement/TokenSettings/Index');
    }

    public function update(Request $request)
    {
        // Implementation for updating token settings

        
    }
}
