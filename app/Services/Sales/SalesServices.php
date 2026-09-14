<?php
namespace App\Services\Sales;

use App\Models\T_Sales;
use App\Models\T_Staff;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class SalesServices
{
    public function search(array $params)
    {
        $query = T_Sales::query()->with('items', 'transactions');

        switch ($params['search_by'] ?? null) {

            case 'invoice':
                $query->where(
                    'invoice_number',
                    'like',
                    '%' . ($params['query'] ?? '') . '%'
                );
                break;

            case 'cashier':
                $query->whereHas('cashier', function (Builder $query) use ($params) {
                    $query->where(
                        'name',
                        'like',
                        '%' . ($params['query'] ?? '') . '%'
                    );
                });
                break;

            case 'payment':
                $query->where(
                    'payment_method',
                    $params['query'] ?? ''
                );
                break;

            case 'date':
                $this->searchByDate(
                    $query,
                    $params['date_from'] ?? null,
                    $params['date_to'] ?? null
                );
                break;
        }

        return $query
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    private function searchByDate(
        Builder $query,
        ?string $dateFrom,
        ?string $dateTo
    ): void {
        if (!$dateFrom) {
            return;
        }

        $query->whereDate('created_at', '>=', $dateFrom);

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }
    }

    public function create(array $data): T_Sales
    {
        return DB::transaction(function () use ($data) {

            $cashier = T_Staff::findOrFail(
                $data['cashier_id']
            );

            $sale = T_Sales::create([
                'invoice_number' => $data['invoice_number'],
                'cashier_id' => $cashier->id,
                'cashier_name' => $cashier->name,
                'transaction_date' => $data['transaction_date'],
                'subtotal' => $data['subtotal'],
                'discount' => $data['discount'],
                'tax' => $data['tax'],
                'grand_total' => $data['grand_total'],
                'status' => $data['status'],
            ]);

            foreach ($data['items'] as $item) {
                $sale->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'discount' => $item['discount'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            $sale->transactions()->create([
                'transaction_type' => $data['transaction']['transaction_type'],
                'amount' => $data['transaction']['amount'],
                'payment_method' => $data['transaction']['payment_method'],
                'reference_number' => $data['transaction']['reference_number'] ?? null,
                'processed_at' => $data['transaction']['processed_at'],
                'status' => $data['transaction']['status'],
                'notes' => $data['transaction']['notes'] ?? null,
            ]);

            return $sale->fresh([
                'items',
                'transactions',
                'cashier',
            ]);
        });
    }
}