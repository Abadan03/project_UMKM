<?php

namespace App\Http\Controllers\StoreManagement;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TaxSettingsController extends Controller
{
    //
    public function index() {

        return Inertia::render('StoreManagement/TaxSettings/Index');
    }
}
