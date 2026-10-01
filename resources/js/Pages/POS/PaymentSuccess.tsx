import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function PaymentSuccess({
    sale: initialSale,
    transaction: initialTransaction,
}) {
    const [sale, setSale] = useState(initialSale);
    const [transaction, setTransaction] = useState(initialTransaction);
    const [checking, setChecking] = useState(
        initialTransaction.status !== "completed"
    );

    useEffect(() => {
        if (transaction.status === "completed") {
            setChecking(false);
            return;
        }

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(
                    `/pos/payment/status/${sale.invoice_number}`
                );

                const result = response.data;

                setSale(result.sale);
                setTransaction(result.transaction);

                if (result.transaction.status === "completed") {
                    setChecking(false);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error(
                    "Gagal mengecek status pembayaran:",
                    error
                );
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [sale.invoice_number, transaction.status]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold">
                        Menunggu konfirmasi pembayaran...
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Pembayaran sedang diproses.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md rounded-xl border p-6">
                <h1 className="text-2xl font-bold text-center">
                    Pembayaran Berhasil
                </h1>

                <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                        <span>Invoice</span>
                        <span>{sale.invoice_number}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Total</span>
                        <span>
                            Rp {Number(sale.grand_total).toLocaleString("id-ID")}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Status</span>
                        <span>{transaction.status}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => router.visit("/pos")}
                    className="w-full mt-6 rounded-lg bg-black px-4 py-3 text-white"
                >
                    Kembali ke POS
                </button>
            </div>
        </div>
    );
}