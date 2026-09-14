<?php

use Inertia\Inertia;
use App\Http\Controllers\Compro\ComproController;
use Illuminate\Support\Facades\Route;

// controllerr
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Sales\SalesController;
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
Route::get('/contact', [ComproController::class, 'contact'])->name('contact');
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

    // Inventory
    Route::prefix('inventory')->group(function () {
        Route::get('/', [InventoryController::class, "index"])->name('inventory');
        Route::put('/update/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::get('/view/{id}', [InventoryController::class, 'viewLogs'])->name('inventory.view');
    });

    // units
    Route::prefix('units')->group(function () {
        Route::post('/store', [ProductController::class, 'unitStore'])->name('units.store');
        Route::delete('/destroy/{id}', [ProductController::class, 'unitDestroy'])->name('units.destroy');
    });

    // Products
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, "index"])->name('products');
        Route::get('/search', [ProductController::class, "search"])->name('products.search');
        Route::post('/store', [ProductController::class, 'store'])->name('products.store');
        Route::put('/update/{id}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/destroy/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    });
});

Route::middleware(['auth', 'role:super admin,admin'])->name('user.')->group(function () {

    // Route::resource('users', UsersController::class);
    Route::get('users', [UsersController::class, 'index'])
        ->name('index');
    Route::get('users/search', [UsersController::class, 'search'])
        ->name('search');
    Route::get('users/create', [UsersController::class, 'create'])
        ->name('create');
    Route::post('users', [UsersController::class, 'store'])
        ->name('store');
    Route::get('users/edit/{userId}', [UsersController::class, 'edit'])
        ->name('edit');
    Route::put('users/{userId}', [UsersController::class, 'update'])
        ->name('update');
    Route::delete('users/{userId}', [UsersController::class, 'destroy'])
        ->name('destroy');


    // Staff Management
    Route::get('staff', [\App\Http\Controllers\Staff\StaffController::class, 'index'])
        ->name('staff.index');
    // Route::get('staff/search', [\App\Http\Controllers\StaffController::class, 'search'])
    //     ->name('staff.search');
    // Route::get('staff/create', [\App\Http\Controllers\StaffController::class, 'create'])
    //     ->name('staff.create');
    Route::post('staff', [\App\Http\Controllers\Staff\StaffController::class, 'store'])
        ->name('staff.store');
    // Route::get('staff/edit/{staffId}', [\App\Http\Controllers\Staff\StaffController::class, 'edit'])
    //     ->name('staff.edit');
    Route::put('staff/{staffId}', [\App\Http\Controllers\Staff\StaffController::class, 'update'])
        ->name('staff.update');
    Route::delete('staff/{staffId}', [\App\Http\Controllers\Staff\StaffController::class, 'destroy'])
        ->name('staff.destroy');


    // sales
    Route::get('sales', [SalesController::class, 'index'])
        ->name('sales.index');
    Route::get('sales/search', [SalesController::class, 'search'])
        ->name('sales.search');
    Route::get('sales/view/{id}', [SalesController::class, 'view'])
        ->name('sales.view');
    Route::post('sales/store', [SalesController::class, 'store'])
        ->name('sales.store');
    Route::post('sales/storeTry', [SalesController::class, 'store'])
        ->name('sales.storeTry');
    Route::delete('sales/destroy/{id}', [SalesController::class, 'destroy'])
        ->name('sales.destroy');
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
// Route::middleware(['auth'])
//     ->name('staff.')
//     ->group(function () {
//         Route::get('/dashboard', [\App\Http\Controllers\Staff\StaffDashboard::class, 'index'])->name('dashboard');

//         POS
//         Route::get('/pos', [\App\Http\Controllers\Staff\PosController::class, 'index'])->name('pos.index');
//         Route::post('/pos/transaction', [\App\Http\Controllers\Staff\PosController::class, 'store'])->name('pos.store');
//     });

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'nama' => 'Developer'
//     ]);
// });
