<?php
namespace App\Repositories\Token;

use App\Enums\Midtrans\NotificationsStatus;
use App\Models\T_TokenTopUp;
use App\Models\T_User_Wallets;
use Illuminate\Support\Str;

class TokenRepository
{
    public function getValidToken()
    {
        $getUser = auth()->id();
        return T_User_Wallets::where("user_id", $getUser)->value("balance") ??
            0;
    }

    public function tokenCreate($tokens, $userId)
    {
        $pricePerToken = 120;
        return T_TokenTopUp::create([
            "user_id" => $userId,
            "order_id" => "TOPUP-" . Str::uuid(),
            "tokens" => $tokens,
            "amount" => $tokens * $pricePerToken,
            "status" => "pending",
        ]);
    }
}
