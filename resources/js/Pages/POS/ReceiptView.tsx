import { CheckCircle2 } from "lucide-react";

import { RotateCcw, X } from "lucide-react";

export interface ReceiptLine {
    id: number;
    name: string;
    qty: number;
    lineTotal: number;
}

export interface ReceiptData {
    lines: ReceiptLine[];
    subtotal: number;
    tax: number;
    total: number;
    cash: number;
    change: number;
    time: Date;
    trxId: string;
    cashierName?: string | null;
}

interface Props {
    receipt: ReceiptData;
    onNew: () => void;
}

const rupiah = (n: number) =>
    "Rp" +
    Number(n).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

export default function ReceiptView({ receipt, onNew }: Props) {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#D9D2BF]">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2F6B4F]" />
                    <h2 className="font-semibold text-sm">Transaksi Selesai</h2>
                </div>
                <button
                    onClick={onNew}
                    className="text-[#7C8C82] hover:text-[#1C2A22]"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="text-center mb-4">
                    <h1>LOGO</h1>
                    <h2 className="font-bold">NAMA TOKO</h2>
                    <p className="text-xs text-[#7C8C82] font-mono">
                        {receipt.trxId}
                    </p>
                    <p className="text-xs text-[#7C8C82] font-mono">
                        {receipt.cashierName ?? "Nama Kasir"}
                    </p>
                    <p className="text-xs text-[#7C8C82]">
                        {receipt.time.toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>

                <div className="border-t border-dashed border-[#D9D2BF] pt-3 space-y-2">
                    {receipt.lines.map((l) => (
                        <div
                            key={l.id}
                            className="flex justify-between text-sm"
                        >
                            <span className="text-[#3A473F]">
                                {l.name}{" "}
                                <span className="text-[#A3AFA6]">x{l.qty}</span>
                            </span>
                            <span className="font-mono">
                                {rupiah(l.lineTotal)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-dashed border-[#D9D2BF] mt-3 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#5A6B60]">
                        <span>Subtotal</span>
                        <span className="font-mono">
                            {rupiah(receipt.subtotal)}
                        </span>
                    </div>
                    <div className="flex justify-between text-[#5A6B60]">
                        <span>Pajak (11%)</span>
                        <span className="font-mono">{rupiah(receipt.tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="font-mono">
                            {rupiah(receipt.total)}
                        </span>
                    </div>
                    <div className="flex justify-between text-[#5A6B60]">
                        <span>Tunai</span>
                        <span className="font-mono">
                            {rupiah(receipt.cash)}
                        </span>
                    </div>
                    <div className="flex justify-between text-[#5A6B60]">
                        <span>Kembalian</span>
                        <span className="font-mono">
                            {rupiah(receipt.change)}
                        </span>
                    </div>
                </div>

                <p className="text-center text-xs text-[#A3AFA6] mt-5">
                    Terima kasih atas kunjungan Anda
                </p>
            </div>

            <div className="px-5 py-4 border-t border-[#D9D2BF]">
                <button
                    onClick={onNew}
                    className="w-full py-3 rounded-lg cursor-pointer font-semibold text-sm bg-[#132621] text-white hover:bg-[#0D1D19] flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Transaksi Baru
                </button>
            </div>
        </div>
    );
}
