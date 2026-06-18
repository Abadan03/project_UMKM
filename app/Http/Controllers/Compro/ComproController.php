<?php

namespace App\Http\Controllers\Compro;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ComproController extends Controller
{
    //
    public function feature() {
        return Inertia::render('components/Feature');
    }

    public function pricing() {
        return Inertia::render('components/Pricing');
    }
}
