<?php

use Inertia\Inertia;
use App\Http\Controllers\Compro\ComproController;
use Illuminate\Support\Facades\Route;

// controllerr
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\UsersController;

// =====================
// Guest Only
// =====================

// Render Company Profile
Route::get('/', function () {
    return Inertia::render('Home');
})->name('index');
// COMPRO SECTION ==================
// ===================== Feature Tab
Route::get('/feature', [ComproController::class, 'feature'])->name('feature');

// ===================== Pricing Tab
Route::get('/pricing', [ComproController::class, 'pricing'])->name('pricing');
// COMPRO SECTION END ==================

// =====================
// Authenticate
// =====================
Route::get('/login', [AuthController::class, 'auth'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');

// =====================
// Authenticated
// =====================
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// =====================
// Dashboard
// =====================

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, "index"])->name('dashboard');
    
    Route::get('products', [\App\Http\Controllers\Products\ProductController::class, "index"])->name('products');
    Route::post('/products/store', [ProductController::class, 'store'])->name('products.store');
});

Route::middleware(['auth', 'role:super admin,admin'])->name('user.')->group(function () {

    Route::resource('users', UsersController::class);
});

// =====================
// Super Admin
// =====================
// Route::middleware(['auth', 'role:super_admin'])
//     ->prefix('super-admin')
//     ->name('super-admin.')
//     ->group(function () {
//         // Route::get('/dashboard', [SuperAdminDashboard::class, 'index'])->name('dashboard');

//         // // User Management
//         // Route::resource('/users', \App\Http\Controllers\SuperAdmin\UserController::class);

//         // // Store Management
//         // Route::resource('/stores', \App\Http\Controllers\SuperAdmin\StoreController::class);
//     });

// =====================
// Admin
// =====================
// Route::middleware(['auth', 'role:admin'])
//     ->prefix('admin')
//     ->name('admin.')
//     ->group(function () {
//         Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');

//         // Product Management
//         Route::resource('/products', \App\Http\Controllers\Admin\ProductController::class);

//         // Reporting
//         Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
//     });

// =====================
// Staff
// =====================
Route::middleware(['auth'])
    ->name('staff.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Staff\StaffDashboard::class, 'index'])->name('dashboard');

        // POS
        // Route::get('/pos', [\App\Http\Controllers\Staff\PosController::class, 'index'])->name('pos.index');
        // Route::post('/pos/transaction', [\App\Http\Controllers\Staff\PosController::class, 'store'])->name('pos.store');
    });

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'nama' => 'Developer'
//     ]);
// });
