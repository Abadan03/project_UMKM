<?php

namespace App\Http\Controllers\POS;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\T_Sales;
use App\Models\Inventory;
use App\Models\Product;
use Inertia\Inertia;


// Request
use App\Http\Requests\POS\POSRequest;
use App\Models\T_transaction;
// Repository
use App\Repositories\POS\POSRepository;
use App\Repositories\Tax\TaxRepository;

class CashierController extends Controller
{
    //

    protected $POSRepository;
    protected $TaxRepository;

    public function __construct(POSRepository $POSRepository, TaxRepository $TaxRepository)
    {
        $this->POSRepository = $POSRepository;
        $this->TaxRepository = $TaxRepository;
    }

    public function index () {
        $getAll = $this->POSRepository->getAll();

        $getTaxSettings = $this->TaxRepository->getTaxSettings();
        // dd($getTaxSettings);

        return Inertia::render('POS/Index', [
            'products' => fn () => $getAll,
            'taxSetting' => $getTaxSettings,
        ]);
    }

    public function store (POSRequest $request) {
        try {

            $result = $this->POSRepository->store(
                $request->validated()
            );

            return response()->json($result);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function paymentStatus(string $invoice)
    {
        $sale = T_Sales::where(
            'invoice_number',
            $invoice
        )->first();

        if (!$sale) {
            return response()->json([
                'message' => 'Sale tidak ditemukan.',
            ], 404);
        }

        $transaction = T_transaction::where(
            'sale_id',
            $sale->id
        )->first();

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'sale' => $sale,
            'transaction' => $transaction,
        ]);
    }

    public function paymentSuccess(Request $request)
    {
        // dd('PAYMENT SUCCESS', $request->query('invoice'));
        $invoiceNumber = $request->query('invoice');

        if (!$invoiceNumber) {
            abort(404);
        }

        $sale = T_Sales::where(
            'invoice_number',
            $invoiceNumber
        )->first();

        if (!$sale) {
            abort(404);
        }

        $transaction = T_transaction::where(
            'sale_id',
            $sale->id
        )->first();

        if (!$transaction) {
            abort(404);
        }

        return Inertia::render('POS/PaymentSuccess', [
            'sale' => $sale,
            'transaction' => $transaction,
        ]);
    }
}
