<?php

namespace App\Http\Controllers\StoreManagement;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StoreProfileController extends Controller
{
    //
    public function index () {
        return Inertia::render('StoreManagement/StoreProfile/Index');
    }
}
