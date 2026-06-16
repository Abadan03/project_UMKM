<?php

use App\Http\Controllers\Auth\AuthController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// =====================
// Guest Only
// =====================
Route::get('/', [AuthController::class, 'index'])->name('redirect-default');
Route::get('/login', [AuthController::class, 'index'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
// Route::middleware('guest')->group(function () {
// });

// =====================
// Authenticated
// =====================
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// =====================
// Super Admin
// =====================
Route::middleware(['auth', 'role:super_admin'])
    ->prefix('super-admin')
    ->name('super-admin.')
    ->group(function () {
        Route::get('/dashboard', [SuperAdminDashboard::class, 'index'])->name('dashboard');

        // User Management
        Route::resource('/users', \App\Http\Controllers\SuperAdmin\UserController::class);

        // Store Management
        Route::resource('/stores', \App\Http\Controllers\SuperAdmin\StoreController::class);
    });

// =====================
// Admin
// =====================
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');

        // Product Management
        Route::resource('/products', \App\Http\Controllers\Admin\ProductController::class);

        // Reporting
        Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
    });

// =====================
// Staff
// =====================
Route::middleware(['auth'])
    ->prefix('staff')
    ->name('staff.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Staff\StaffDashboard::class, 'index'])->name('dashboard');

        // POS
        Route::get('/pos', [\App\Http\Controllers\Staff\PosController::class, 'index'])->name('pos.index');
        Route::post('/pos/transaction', [\App\Http\Controllers\Staff\PosController::class, 'store'])->name('pos.store');
    });

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'nama' => 'Developer'
//     ]);
// });
