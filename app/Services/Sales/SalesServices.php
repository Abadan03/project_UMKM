<?php
namespace App\Services\Sales;

use App\Models\Sale;
use App\Models\T_Sales;
use Illuminate\Database\Eloquent\Builder;

class SalesServices
{
    public function search(array $params)
    {
        $query = T_Sales::query();

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
}