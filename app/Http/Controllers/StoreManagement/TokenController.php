<?php

namespace App\Http\Controllers\StoreManagement;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\T_TokenTopUp;
use App\Repositories\Token\TokenRepository;
use Inertia\Inertia;
use Illuminate\Support\Str;

use App\Services\Midtrans\CreateSnapTokenService;

class TokenController extends Controller
{
    protected $TokenRepository;

    public function __construct(
        private CreateSnapTokenService $CreateSnapTokenService,
        TokenRepository $TokenRepository,
    ) {
        $this->TokenRepository = $TokenRepository;
    }

    public function tokenSettings()
    {
        $getTokenSuccess = $this->TokenRepository->getValidToken();
        // return dd($getTokenSuccess);
        return Inertia::render("StoreManagement/TokenSettings/Index", [
            "MidtransClientKey" => config("services.midtrans.client_key"),
            "TokenValid" => $getTokenSuccess ?? null,
        ]);
    }

    public function update(Request $request)
    {
        // Implementation for updating token settings
    }

    public function createPayment(Request $request)
    {
        $validated = $request->validate([
            "tokens" => ["required", "integer", "min:42", "max:100000"],
        ]);

        $tokens = (int) $validated["tokens"];

        $topUp = $this->TokenRepository->tokenCreate(
            $tokens,
            $request->user()->id,
        );

        try {
            $snapToken = $this->CreateSnapTokenService->getSnapToken(
                $topUp->load("user"),
            );

            $topUp->update([
                "snap_token" => $snapToken,
            ]);

            return response()->json([
                "snapToken" => $snapToken,
                "orderId" => $topUp->order_id,
            ]);
        } catch (\Throwable $e) {
            report($e);

            $topUp->update([
                "status" => "failed",
            ]);

            return response()->json(
                [
                    "message" => "Gagal membuat pembayaran. Silakan coba lagi.",
                ],
                500,
            );
        }
    }
}
