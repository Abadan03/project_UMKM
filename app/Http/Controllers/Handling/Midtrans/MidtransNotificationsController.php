<?php

namespace App\Http\Controllers\Handling\Midtrans;

use App\Enums\Midtrans\NotificationsStatus;
use App\Http\Controllers\Controller;
use App\Models\T_TokenTopUp;
use App\Models\T_User_Wallets;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

use function PHPUnit\Framework\throwException;

class MidtransNotificationsController extends Controller
{
    //
    public function handleNotifications(Request $request)
    {
        $serverKey = config("services.midtrans.server_key");

        // 2. Extract values from the incoming JSON payload
        $orderId = $request->input("order_id");
        $statusCode = $request->input("status_code");
        $grossAmount = $request->input("gross_amount");
        $signatureKey = $request->input("signature_key");
        $transactionStatus = $request->input("transaction_status");
        $fraudStatus = $request->input("fraud_status");
        $paymentType = $request->input("payment_type");

        // 3. Verify Signature Key for security
        // Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
        $mySignatureKey = hash(
            "sha512",
            $orderId . $statusCode . $grossAmount . $serverKey,
        );

        if ($mySignatureKey !== $signatureKey) {
            return response()->json(
                ["message" => "Invalid signature key"],
                403,
            );
        }

        // 4. Find the order in your database
        $order = T_TokenTopUp::where("order_id", $orderId)->first();

        if (!$order) {
            return response()->json(["message" => "Order not found"]);
        }

        // 5. Handle the transaction status
        if ($transactionStatus == "capture") {
            if ($fraudStatus == "challenge") {
                $order->status = "challenge";
            }
            // elseif ($fraudStatus == "accept") {
            //     $order->status = "success";
            // }
        } elseif (
            ($fraudStatus == NotificationsStatus::accept &&
                $transactionStatus == "capture") ||
            $transactionStatus == "settlement"
        ) {
            // $order->status = "success";
            try {
                DB::transaction(function () use ($order) {
                    // Cek apakah order belum pernah diproses sukses (mencegah double saldo jika Midtrans mengirim notif 2 kali)
                    if ($order->status !== "success") {
                        // 1. Ubah status top up menjadi success
                        $order->status = "success";
                        $order->save();

                        // 2. Tambahkan saldo ke user_wallets
                        // Logika: Cari wallet berdasarkan user_id. Jika belum ada, BUAT (Create) dengan saldo 0.
                        $wallet = T_User_Wallets::firstOrCreate(
                            ["user_id" => $order->user_id],
                            ["balance" => 0],
                        );

                        // Jika sudah ada (atau baru saja dibuat), TAMBAH (Update/Increment) saldonya
                        // Pastikan kamu menyesuaikan '$order->tokens' dengan nama kolom jumlah token di tabel T_TokenTopUp kamu
                        $wallet->increment("balance", $order->tokens);
                    }
                });
            } catch (\Throwable $e) {
                report($e);
            }
        } elseif (
            $transactionStatus == "cancel" ||
            $transactionStatus == "deny" ||
            $transactionStatus == "expire"
        ) {
            $order->status = "failed";
            $order->save();
        } elseif ($transactionStatus == "pending") {
            $order->status = "pending";
            $order->save();
        }

        $order->save();

        return response()->json(
            ["message" => "Notification handled successfully"],
            200,
        );
    }
}
