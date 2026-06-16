<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StaffDashboard extends Controller
{
    //
    public function index()
    {
        // dd(Auth()->user);
        return Inertia::render('Staff/Dashboard');
        // dd(Auth()->user);
    }
}
