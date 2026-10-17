import type { ReactNode } from "react";
import {
    Minus,
    Plus,
    Receipt,
    Trash2,
    Wallet,
} from "lucide-react";
import type { XenditComponents } from "xendit-components-web";
import { toast } from "sonner";
import ReceiptView, { type ReceiptData } from "@/Pages/POS/ReceiptView";
import type { PaymentMethodEnum, POSCartLine, TaxSettingForm } from "@/types";

const QUICK_CASH = [20000, 50000, 100000, 200000];
const PAYMENT_METHODS: PaymentMethodEnum[] = ["CASH", "E-PAYMENT"];

interface CheckoutAsideProps {
    receipt: ReceiptData | null;
    onNewTransaction: () => void;
    hasCheckedOut: boolean;
    paymentInvoice: string | null;
    hasRestoredPaymentAction: boolean;
    cancellingPayment: boolean;
    onCancelPendingPayment: () => void;
    cartLines: POSCartLine[];
    onDecrement: (productId: number) => void;
    onAddToCart: (productId: number) => void;
    onRemoveLine: (productId: number) => void;
    subtotal: number;
    taxSetting: TaxSettingForm;
    tax: number;
    total: number;
    paymentMethod: PaymentMethodEnum;
    onPaymentMethodChange: (method: PaymentMethodEnum) => void;
    cash: string;
    onCashChange: (cash: string) => void;
    change: number;
    showPaymentComponent: boolean;
    showPanelPayment: boolean;
    onShowPanelPaymentChange: (show: boolean) => void;
    restoringPaymentSession: boolean;
    xenditPaymentReady: boolean;
    xenditSubmitting: boolean;
    xenditComponents: XenditComponents | null;
    onPay: () => void;
    canPay: boolean;
    processing: boolean;
    xenditPayment: ReactNode;
    formatCurrency: (amount: number | string) => string;
}

export default function CheckoutAside({
    receipt,
    onNewTransaction,
    hasCheckedOut,
    paymentInvoice,
    hasRestoredPaymentAction,
    cancellingPayment,
    onCancelPendingPayment,
    cartLines,
    onDecrement,
    onAddToCart,
    onRemoveLine,
    subtotal,
    taxSetting,
    tax,
    total,
    paymentMethod,
    onPaymentMethodChange,
    cash,
    onCashChange,
    change,
    showPaymentComponent,
    showPanelPayment,
    onShowPanelPaymentChange,
    restoringPaymentSession,
    xenditPaymentReady,
    xenditSubmitting,
    xenditComponents,
    onPay,
    canPay,
    processing,
    xenditPayment,
    formatCurrency,
}: CheckoutAsideProps) {
    return (
        <aside className="w-full flex-1 overflow-y-auto overscroll-contain bg-white border-t lg:border-t-0 lg:border-l border-[#D9D2BF] flex flex-col min-h-0 lg:flex-none lg:w-[380px]">
            {receipt ? (
                <ReceiptView receipt={receipt} onNew={onNewTransaction} />
            ) : (
                <>
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-[#D9D2BF]">
                        <Receipt className="w-4 h-4 text-[#7C8C82]" />
                        <h2 className="font-semibold text-sm">
                            Pesanan Saat Ini
                        </h2>
                    </div>

                    {hasCheckedOut && paymentInvoice && (
                        <div className="mx-4 mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
                            <p className="font-semibold">
                                Pembayaran masih tertunda
                            </p>
                            <p className="mt-1 text-xs">
                                Invoice: {paymentInvoice}.{" "}
                                {hasRestoredPaymentAction
                                    ? "QR/VA dari sesi yang sama ditampilkan kembali."
                                    : "Item dipulihkan sebagai referensi. Sesi pembayaran sedang dipulihkan."}{" "}
                                Transaksi sudah tercatat; jangan checkout ulang.
                            </p>
                            <button
                                type="button"
                                onClick={onCancelPendingPayment}
                                disabled={cancellingPayment}
                                className="mt-3 rounded-md border border-amber-700 px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-50"
                            >
                                {cancellingPayment
                                    ? "Membatalkan..."
                                    : "Batalkan transaksi pending"}
                            </button>
                        </div>
                    )}

                    <div className="p-4 min-h-[45%] overflow-y-auto">
                        {cartLines.length === 0 ? (
                            <p className="text-sm text-[#7C8C82] text-center py-10">
                                Belum ada item. Ketuk menu untuk menambahkan.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {cartLines.map((line) => (
                                    <li
                                        key={line.id}
                                        className="flex items-start justify-between gap-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {line.name}
                                            </p>
                                            <p className="text-xs text-[#7C8C82] font-mono">
                                                {formatCurrency(
                                                    line.sell_price,
                                                )}{" "}
                                                x {line.qty}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                disabled={hasCheckedOut}
                                                onClick={() =>
                                                    onDecrement(line.id)
                                                }
                                                className="w-6 h-6 rounded-md cursor-pointer border border-[#D9D2BF] flex items-center justify-center hover:bg-[#F7F3E8] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm w-4 text-center font-mono">
                                                {line.qty}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={hasCheckedOut}
                                                onClick={() =>
                                                    onAddToCart(line.id)
                                                }
                                                className="w-6 h-6 rounded-md cursor-pointer border border-[#D9D2BF] flex items-center justify-center hover:bg-[#F7F3E8] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={hasCheckedOut}
                                                onClick={() =>
                                                    onRemoveLine(line.id)
                                                }
                                                className="w-6 h-6 rounded-md cursor-pointer flex items-center justify-center text-[#B54A3F] hover:bg-[#F7ECEA] ml-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="border-t border-[#D9D2BF] px-5 py-4 space-y-3">
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-[#5A6B60]">
                                <span>Subtotal</span>
                                <span className="font-mono">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-[#5A6B60]">
                                <span>
                                    Pajak {taxSetting?.name} (
                                    {taxSetting?.percentage}%)
                                </span>
                                <span className="font-mono">
                                    {formatCurrency(tax)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#132621] rounded-lg px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-[#9CB3A8] uppercase tracking-wide">
                                Total
                            </span>
                            <span className="font-mono text-xl font-semibold text-[#F2B24E]">
                                {formatCurrency(total)}
                            </span>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Payment Method
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        disabled={
                                            hasCheckedOut ||
                                            (showPaymentComponent &&
                                                method ===
                                                    "CASH")
                                        }
                                        onClick={() => {
                                            if (
                                                showPaymentComponent &&
                                                method !== "E-PAYMENT"
                                            ) {
                                                return;
                                            }
                                            onPaymentMethodChange(method);
                                            if (method === "E-PAYMENT") {
                                                onCashChange("");
                                            }
                                        }}
                                        className={`cursor-pointer px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
                                            paymentMethod === method
                                                ? "bg-[#132621] text-white border-[#132621]"
                                                : "bg-[#F7F3E8] text-[#5A6B60] border-[#D9D2BF] hover:border-[#E3A23C]"
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {paymentMethod === "CASH" ? (
                            <>
                                <div>
                                    <label className="text-xs text-[#7C8C82] mb-1 block">
                                        Uang diterima
                                    </label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3AFA6]" />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={
                                                cash === ""
                                                    ? ""
                                                    : formatCurrency(cash)
                                            }
                                            onChange={(event) =>
                                                onCashChange(
                                                    event.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            placeholder="Rp0"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9D2BF] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#E3A23C]"
                                        />
                                    </div>
                                    <div className="flex gap-1.5 mt-2 flex-wrap">
                                        {QUICK_CASH.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() =>
                                                    onCashChange(
                                                        String(amount),
                                                    )
                                                }
                                                className="cursor-pointer px-2.5 py-1 rounded-md bg-[#F7F3E8] border border-[#D9D2BF] text-xs font-mono hover:border-[#E3A23C]"
                                            >
                                                {formatCurrency(amount)}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onCashChange(String(total))
                                            }
                                            className="px-2.5 py-1 rounded-md bg-[#F7F3E8] border border-[#D9D2BF] text-xs font-mono hover:border-[#E3A23C]"
                                        >
                                            Uang pas
                                        </button>
                                    </div>
                                </div>

                                {cash !== "" && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#5A6B60]">
                                            Kembalian
                                        </span>
                                        <span
                                            className={`font-mono font-semibold ${
                                                change < 0
                                                    ? "text-[#B54A3F]"
                                                    : "text-[#2F6B4F]"
                                            }`}
                                        >
                                            {change < 0 ? "Kurang " : ""}
                                            {formatCurrency(Math.abs(change))}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : paymentMethod === "E-PAYMENT" &&
                          showPaymentComponent ? (
                            hasRestoredPaymentAction ? (
                                <p className="text-xs text-[#7C8C82]">
                                    QR/VA aktif dari sesi pembayaran yang sama.
                                </p>
                            ) : (
                                xenditPayment
                            )
                        ) : null}

                        {hasCheckedOut &&
                            paymentInvoice &&
                            paymentMethod === "E-PAYMENT" && (
                                <p className="text-xs text-[#7C8C82]">
                                    {restoringPaymentSession
                                        ? "Memulihkan sesi pembayaran..."
                                        : hasRestoredPaymentAction
                                          ? "QR/VA aktif dipulihkan dari sesi yang sama."
                                          : "Pilih kembali QRIS atau Virtual Account untuk melanjutkan sesi yang sama."}
                                </p>
                            )}

                        <div className="pt-3 shrink-0">
                            {paymentMethod === "E-PAYMENT" &&
                            showPaymentComponent ? (
                                hasRestoredPaymentAction ? (
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onShowPanelPaymentChange(
                                                    !showPanelPayment,
                                                )
                                            }
                                            className="w-full py-3 rounded-lg font-semibold text-sm bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                                        >
                                            {showPanelPayment
                                                ? "Tutup QR Pembayaran"
                                                : "Tampilkan QR Pembayaran"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onCancelPendingPayment}
                                            disabled={
                                                cancellingPayment ||
                                                restoringPaymentSession
                                            }
                                            className="w-full py-3 rounded-lg font-semibold text-sm bg-[#132621] text-[#D6922F] disabled:opacity-50"
                                        >
                                            {cancellingPayment
                                                ? "Membatalkan..."
                                                : "Batalkan Transaksi Pending"}
                                        </button>
                                    </div>
                                ) : showPanelPayment ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!xenditComponents) {
                                                toast.error("Xendit belum siap.");
                                                return;
                                            }
                                            if (!xenditPaymentReady) {
                                                xenditComponents.showValidationErrors();
                                                return;
                                            }
                                            xenditComponents.submit();
                                        }}
                                        disabled={
                                            !xenditPaymentReady ||
                                            xenditSubmitting ||
                                            restoringPaymentSession
                                        }
                                        className="w-full py-3 rounded-lg font-semibold text-sm transition-colors disabled:bg-[#E3DFD2] disabled:text-[#A3AFA6] bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                                    >
                                        {xenditSubmitting
                                            ? "Memproses Pembayaran..."
                                            : paymentInvoice
                                              ? "Lanjutkan Pembayaran"
                                              : "Bayar Sekarang"}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onShowPanelPaymentChange(true)
                                            }
                                            className="w-full py-3 cursor-pointer rounded-lg font-semibold text-sm transition-colors bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                                        >
                                            Tampilkan Panel Pembayaran
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onCancelPendingPayment}
                                            disabled={
                                                cancellingPayment ||
                                                restoringPaymentSession
                                            }
                                            className="w-full py-3 cursor-pointer mt-2 rounded-lg font-semibold text-sm transition-colors bg-[#132621] text-[#D6922F] hover:bg-[#132621]"
                                        >
                                            {cancellingPayment
                                                ? "Membatalkan..."
                                                : "Batalkan Transaksi & Buat Baru"}
                                        </button>
                                    </>
                                )
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={onPay}
                                        disabled={
                                            !canPay ||
                                            processing ||
                                            hasCheckedOut
                                        }
                                        className="w-full py-3 rounded-lg font-semibold text-sm transition-colors disabled:bg-[#E3DFD2] disabled:text-[#A3AFA6] bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                                    >
                                        {hasCheckedOut
                                            ? "Transaksi sudah dibuat"
                                            : processing
                                              ? "Memproses..."
                                              : "Bayar"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
}
