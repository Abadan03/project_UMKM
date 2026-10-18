<?php

use App\Http\Controllers\Handling\Midtrans\MidtransNotificationsController;

require __DIR__ . "/api/auth.php";

// =====================
// Handle Midtrans Notifications
// =====================
Route::post("/midtrans/notification", [
    MidtransNotificationsController::class,
    "handleNotifications",
]);
