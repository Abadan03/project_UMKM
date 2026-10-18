<?php

use Inertia\Inertia;
use App\Http\Controllers\Compro\ComproController;
use Illuminate\Support\Facades\Route;

// controllerr
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Handling\Midtrans\MidtransNotificationsController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Notes\NotesController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Sales\SalesController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\POS\CashierController;
use App\Http\Controllers\Products\CategoriesController;
use App\Http\Controllers\StoreManagement\StoreManagementController;
use App\Http\Controllers\StoreManagement\StoreProfileController;
use App\Http\Controllers\StoreManagement\TaxSettingsController;
use App\Http\Controllers\StoreManagement\TokenController;
use App\Http\Controllers\StoreManagement\XenditSettingsController;

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
// Webhooks Xendit
// =====================
Route::post('/xenditSettings-handle/{storeId}', [XenditSettingsController::class, 'handle'])->name('webhooks.xendit');

// =====================
// POS Payment Redirect
// =====================
Route::get('/pos/payment/success',[CashierController::class, 'paymentSuccess'])->name('pos.payment.success');

// =====================
// Dashboard
// =====================

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, "index"])->name('dashboard');

    // Inventory
    Route::prefix('inventory')->group(function () {
        Route::get('/', [InventoryController::class, "index"])->name('inventory');
        Route::get('/logs', [InventoryController::class, 'logs'])->name('inventory.logs');
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

    // Categories
    Route::prefix('categories')->group(function () {
        Route::post('/store', [CategoriesController::class, 'store'])->name('categories.store');
        // Route::delete('/destroy/{id}', [ProductController::class, 'unitDestroy'])->name('units.destroy');
    });

    // Cashier
    Route::prefix('pos')->group(function () {
        Route::get('/', [CashierController::class, "index"])->name('cashier');
        Route::post('/checkout', [CashierController::class, 'store'])->name('pos.checkout');

        Route::post(
            '/payment/cancel/{invoice}',
            [CashierController::class, 'cancelPayment']
        )->name('pos.payment.cancel');

        Route::get(
            '/payment/status/{invoice}',
            [CashierController::class, 'paymentStatus']
        )->name('pos.payment.status');

        Route::get(
            '/payment/session-key/{invoice}',
            [CashierController::class, 'paymentSessionKey']
        )->name('pos.payment.session-key');
    });

    // Store Management
    Route::prefix('storeManagement')->group(function () {
        Route::get('/', [StoreProfileController::class, 'index'])->name('StoreManage');
        Route::get('/taxSettings', [TaxSettingsController::class, 'index'])->name('store.taxsettings');
        
        // PROFILE TOKO
        Route::post('/profile-stores', [StoreProfileController::class, 'index'])->name('store-management.profile.update');

        // XENDIT
        Route::get('/xenditSettings', [XenditSettingsController::class, 'index'])->name('store-management.xendit-settings');
        Route::post('/xenditSettings-test', [XenditSettingsController::class, 'test'])->name('store-management.xendit-settings.test');
        Route::post('/xenditSettings', [XenditSettingsController::class, 'update'])
        ->name('store-management.xendit-settings.update');

        // TOKEN
        Route::get('/tokenSettings', [TokenController::class, 'tokenSettings'])->name('store-management.token-settings');
        Route::post('/tokenSettings', [TokenController::class, 'updateTokenSettings'])->name('store-management.token-settings.update');


        // TAX SETTINGS
        Route::get('/taxSettings', [TaxSettingsController::class, 'index'])->name('store-management.tax-settings');
        Route::post('/taxSettings', [TaxSettingsController::class, 'update'])->name('store-management.tax-settings.update');
        
        
        // Route::post('/tokenSettings', [TokenController::class, 'updateTokenSettings'])->name('store-management.token-settings.update');
        // Route::delete('/destroy/{id}', [ProductController::class, 'unitDestroy'])->name('units.destroy');
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


        // notes

        route::get("notes", [NotesController::class, "index"])->name(
            "notex.index",
        );
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
