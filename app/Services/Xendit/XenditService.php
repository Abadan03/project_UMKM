<?php

namespace App\Services\Xendit;

use App\Enums\XenditSettings\XenditWebhookType;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XenditService
{
    private const BASE_URL = 'https://api.xendit.co';

    public function registerWebhook(string $apiKey, XenditWebhookType $type, string $callbackUrl): ?array
    {
        $response = Http::withBasicAuth($apiKey, '')
            ->post(self::BASE_URL . "/callback_urls/{$type->value}", [
                'url' => $callbackUrl,
            ]);

        Log::info('Xendit registerWebhook response', [
            'status_code' => $response->status(),
            'body' => $response->json(),
            'callback_url' => $callbackUrl,
        ]);

        if ($response->failed()) {
            return null;
        }

        return $response->json();
        // struktur DATAR: status, url, environment, callback_token
    }

    public function testApiKey(string $apiKey): bool
    {
        $response = Http::withBasicAuth($apiKey, '')
            ->get(self::BASE_URL . '/balance');

        return $response->successful();
    }

    public function createInvoice(string $apiKey, array $payload): ?array
    {
        $response = Http::withBasicAuth($apiKey, '')
            ->post(self::BASE_URL . '/v2/invoices', $payload);

        Log::info('Xendit createInvoice response', [
            'status_code' => $response->status(),
            'body' => $response->body(),
        ]);

        if ($response->failed()) {
            Log::error('Xendit createInvoice failed', [
                'status_code' => $response->status(),
                'body' => $response->body(),
                'json' => $response->json(),
            ]);

            throw new \Exception(
                'Xendit Error: ' . $response->body()
            );
        }

        return $response->json();
    }

    public function createPaymentSession(string $apiKey, array $payload): ?array
    {
        $response = Http::withBasicAuth($apiKey, '')
            ->post(self::BASE_URL . '/sessions', $payload);

        Log::info('Xendit createPaymentSession response', [
            'status_code' => $response->status(),
        ]);

        if ($response->failed()) {
            Log::error('Xendit createPaymentSession failed', [
                'status_code' => $response->status(),
            ]);

            throw new \Exception(
                'Xendit gagal membuat sesi pembayaran.'
            );
        }

        return $response->json();
    }

    public function getPaymentSession(string $apiKey, string $sessionId): ?array
    {
        $response = Http::withBasicAuth($apiKey, '')
            ->get(self::BASE_URL . '/sessions/' . rawurlencode($sessionId));

        if ($response->failed()) {
            Log::error('Xendit getPaymentSession failed', [
                'status_code' => $response->status(),
                'session_id' => $sessionId,
            ]);

            throw new \Exception(
                'Xendit gagal mengambil sesi pembayaran.'
            );
        }

        return $response->json();
    }
}