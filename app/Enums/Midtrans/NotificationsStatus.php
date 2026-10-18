<?php

namespace App\Enums\Midtrans;

enum NotificationsStatus: string
{
    case success = "success";
    case accept = "accept";
    case pending = "pending";
    case error = "error";

    public function label(): string
    {
        return match ($this) {
            self::success => "success",
            self::accept => "accept",
            self::pending => "pending",
            self::error => "error",
        };
    }
}
