<?php

namespace App\Services\Midtrans;

use Midtrans\Snap;

class CreateSnapTokenService extends MidtransService
{
    public function getSnapToken($order)
    {
        $user = $order->user;
        $params = [
            "transaction_details" => [
                "order_id" => $order->order_id,
                "gross_amount" => (int) $order->amount,
            ],
            // 'item_details' => [
            //     [
            //         'id' => 1,
            //         'price' => '150000',
            //         'quantity' => 1,
            //         'name' => 'Flashdisk Toshiba 32GB',
            //     ],
            //     [
            //         'id' => 2,
            //         'price' => '60000',
            //         'quantity' => 2,
            //         'name' => 'Memory Card VGEN 4GB',
            //     ],
            // ],
            "customer_details" => [
                "first_name" => $user->name,
                "email" => $user->email,
                // 'phone' => $user->phone,
            ],
        ];

        // $snapToken = Snap::getSnapToken($params);

        return Snap::getSnapToken($params);
    }
}
