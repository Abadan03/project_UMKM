import { useState, useMemo, useEffect, useRef } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { usePage, router } from "@inertiajs/react";
import { XenditComponents } from "xendit-components-web";
import { toast } from "sonner";
import type { ReceiptData } from "@/Pages/POS/ReceiptView";
import axios from "axios";
import {
    ProductProps,
    POSCart,
    POSCartLine,
    SharedData,
    TaxSettingForm,
    type BreadcrumbItem,
    type PaymentMethodEnum,
} from "@/types";
import ProductCatalog from "@/Pages/POS/ProductCatalog";
import CheckoutAside from "@/Pages/POS/CheckoutAside";
import XenditPayment from "@/Pages/POS/XenditPayment";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Cashier",
        href: "/pos",
    },
];

const POS_DRAFT_VERSION = 1;
const PAYMENT_METHOD = {
    CASH: "CASH",
    E_PAYMENT: "E-PAYMENT",
} as const;

type POSDraft = {
    version: typeof POS_DRAFT_VERSION;
    cart: POSCart;
    cash: string;
    paymentMethod: PaymentMethodEnum;
    invoiceNumber?: string | null;
};

const getStringProperty = (
    value: Record<string, unknown>,
    key: string,
): string | null => (typeof value[key] === "string" ? value[key] : null);

const loadPOSDraft = (storageKey: string): POSDraft | null => {
    if (typeof window === "undefined") return null;

    try {
        const storedDraft = window.sessionStorage.getItem(storageKey);
        if (!storedDraft) return null;

        const parsedDraft: unknown = JSON.parse(storedDraft);
        if (
            !parsedDraft ||
            typeof parsedDraft !== "object" ||
            !("version" in parsedDraft) ||
            parsedDraft.version !== POS_DRAFT_VERSION ||
            !("cart" in parsedDraft) ||
            !parsedDraft.cart ||
            typeof parsedDraft.cart !== "object" ||
            !("cash" in parsedDraft) ||
            typeof parsedDraft.cash !== "string" ||
            !("paymentMethod" in parsedDraft) ||
            ("invoiceNumber" in parsedDraft &&
                typeof parsedDraft.invoiceNumber !== "string")
        ) {
            return null;
        }

        const draftRecord = parsedDraft as Record<string, unknown>;
        const cash = getStringProperty(draftRecord, "cash");
        if (cash === null) return null;

        const cart = Object.fromEntries(
            Object.entries(draftRecord.cart as Record<string, unknown>).filter(
                ([id, quantity]) =>
                    /^\d+$/.test(id) &&
                    Number.isSafeInteger(quantity) &&
                    Number(quantity) > 0,
            ),
        ) as POSCart;

        if (Object.keys(cart).length === 0) return null;

        return {
            version: POS_DRAFT_VERSION,
            cart,
            cash: cash.replace(/\D/g, ""),
            paymentMethod:
                draftRecord.paymentMethod === PAYMENT_METHOD.E_PAYMENT
                    ? PAYMENT_METHOD.E_PAYMENT
                    : PAYMENT_METHOD.CASH,
            invoiceNumber: getStringProperty(draftRecord, "invoiceNumber"),
        };
    } catch (error) {
        console.error("Gagal memuat draft transaksi POS:", error);
        return null;
    }
};

const findPaymentActionOverlay = (
    invoiceNumber: string,
): HTMLDivElement | null =>
    Array.from(
        document.querySelectorAll<HTMLDivElement>("[data-pos-payment-invoice]"),
    ).find((overlay) => overlay.dataset.posPaymentInvoice === invoiceNumber) ??
    null;

const rupiah = (n: number | string) =>
    "Rp" +
    Number(n).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

export default function index({ taxSetting }: { taxSetting: TaxSettingForm }) {
    const page = usePage<
        SharedData & {
            products: { data: ProductProps[] };
            balance?: number | null;
        }
    >();
    const balance = page.props.balance ?? 0;
    const { data: PRODUCTS } = page.props.products;
    const draftStorageKey = `pos-draft:v${POS_DRAFT_VERSION}:${page.props.auth.user.id}`;
    const [initialDraft] = useState(() => loadPOSDraft(draftStorageKey));
    const [isMaximized, setIsMaximized] = useState(false);
    const posContainerRef = useRef<HTMLDivElement>(null);
    const [xenditSdkKey, setXenditSdkKey] = useState<string | null>(null);
    const [paymentInvoice, setPaymentInvoice] = useState<string | null>(
        () => initialDraft?.invoiceNumber ?? null,
    );
    const [category, setCategory] = useState("Semua");
    const [query, setQuery] = useState("");
    const [cart, setCart] = useState<POSCart>(() => initialDraft?.cart ?? {});
    const [cash, setCash] = useState(() => initialDraft?.cash ?? "");
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);
    const [processing, setProcessing] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(() =>
        initialDraft?.invoiceNumber
            ? PAYMENT_METHOD.E_PAYMENT
            : (initialDraft?.paymentMethod ?? PAYMENT_METHOD.CASH),
    );
    const [showPaymentComponent, setShowPaymentComponent] = useState(false);
    const [showPanelPayment, setShowPanelPayment] = useState(false);
    const [hasRestoredPaymentAction, setHasRestoredPaymentAction] =
        useState(false);
    const actionOverlayRef = useRef<HTMLDivElement | null>(null);
    const [xenditComponents, setXenditComponents] =
        useState<XenditComponents | null>(null);

    const [xenditPaymentReady, setXenditPaymentReady] = useState(false);

    const [xenditSubmitting, setXenditSubmitting] = useState(false);
    const [restoringPaymentSession, setRestoringPaymentSession] = useState(() =>
        Boolean(initialDraft?.invoiceNumber),
    );
    const [cancellingPayment, setCancellingPayment] = useState(false);
    const switchingPaymentMethodRef = useRef(false);
    const cleanupXenditActionRef = useRef<(() => void) | null>(null);
    const draftStorageErrorNotifiedRef = useRef(false);
    const paymentCompletionHandledRef = useRef(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(() =>
        Boolean(initialDraft?.invoiceNumber),
    );

    const handleFullscreenToggle = async (shouldMaximize: boolean) => {
        const posContainer = posContainerRef.current;
        if (!posContainer) return;

        try {
            if (shouldMaximize && document.fullscreenElement !== posContainer) {
                await posContainer.requestFullscreen();
            } else if (
                !shouldMaximize &&
                document.fullscreenElement === posContainer
            ) {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error("Gagal mengubah mode fullscreen POS:", error);
            toast.error("Mode fullscreen tidak dapat diaktifkan.");
        }
    };

    useEffect(() => {
        const updateFullscreenState = () => {
            setIsMaximized(
                document.fullscreenElement === posContainerRef.current,
            );
        };

        document.addEventListener("fullscreenchange", updateFullscreenState);
        return () => {
            document.removeEventListener(
                "fullscreenchange",
                updateFullscreenState,
            );
        };
    }, []);

    const handleSwitchPaymentMethod = async (components: XenditComponents) => {
        if (switchingPaymentMethodRef.current) return;

        if (!paymentInvoice) {
            toast.error("Nomor transaksi pembayaran tidak ditemukan.");
            return;
        }

        switchingPaymentMethodRef.current = true;
        try {
            const response = await axios.get(
                `/pos/payment/status/${encodeURIComponent(paymentInvoice)}`,
            );
            const status = String(
                response.data.transaction?.status ?? "",
            ).toLowerCase();

            if (status !== "pending") {
                toast.error(
                    status === "completed"
                        ? "Pembayaran sudah berhasil. Tidak dapat mengganti metode."
                        : "Status pembayaran belum dapat dipastikan. Coba periksa kembali sebelum mengganti metode.",
                );
                return;
            }

            components.abortSubmission();
            components.setCurrentChannel(null);
            setXenditPaymentReady(false);
            setXenditSubmitting(false);
            setShowPanelPayment(true);
            toast.info(
                "Metode pembayaran sebelumnya dibatalkan. Pilih QRIS atau Virtual Account.",
            );
        } catch (error) {
            console.error("Gagal mengganti metode pembayaran:", error);
            const message = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : error instanceof Error
                  ? error.message
                  : null;
            toast.error(
                message ||
                    "Tidak dapat mengganti metode pembayaran. Periksa status transaksi lalu coba lagi.",
            );
        } finally {
            switchingPaymentMethodRef.current = false;
        }
    };

    const handleCancelPendingPayment = async () => {
        if (!paymentInvoice || cancellingPayment) {
            toast.error("Transaksi pembayaran aktif tidak ditemukan.");
            return;
        }

        setCancellingPayment(true);
        try {
            const response = await axios.post(
                `/pos/payment/cancel/${encodeURIComponent(paymentInvoice)}`,
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Transaksi gagal dibatalkan.",
                );
            }

            try {
                xenditComponents?.abortSubmission();
            } catch (abortError) {
                console.error(
                    "Xendit SDK gagal menghentikan payment request:",
                    abortError,
                );
            }

            cleanupXenditActionRef.current?.();
            findPaymentActionOverlay(paymentInvoice)?.remove();
            setXenditComponents(null);
            setXenditSdkKey(null);
            setPaymentInvoice(null);
            setShowPaymentComponent(false);
            setShowPanelPayment(false);
            setXenditPaymentReady(false);
            setXenditSubmitting(false);
            setHasCheckedOut(false);
            setHasRestoredPaymentAction(false);
            setCart({});
            setCash("");

            toast.success("Transaksi pembayaran berhasil dibatalkan.");
        } catch (error) {
            console.error("Gagal membatalkan transaksi pembayaran:", error);
            const message = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : error instanceof Error
                  ? error.message
                  : null;
            toast.error(message || "Gagal membatalkan transaksi.");
        } finally {
            setCancellingPayment(false);
        }
    };

    const handleVerifiedPayment = () => {
        if (paymentCompletionHandledRef.current) return false;
        paymentCompletionHandledRef.current = true;

        setShowPaymentComponent(false);
        setShowPanelPayment(false);
        setHasRestoredPaymentAction(false);
        setXenditSdkKey(null);
        setPaymentInvoice(null);
        setXenditPaymentReady(false);
        setHasCheckedOut(true);
        try {
            window.sessionStorage.removeItem(draftStorageKey);
        } catch (storageError) {
            console.error(
                "Gagal menghapus draft setelah pembayaran selesai:",
                storageError,
            );
        }

        return true;
    };

    const handleXenditSessionComplete = async () => {
        if (!paymentInvoice) {
            toast.error("Nomor transaksi pembayaran tidak ditemukan.");
            return;
        }

        try {
            const response = await axios.get(
                `/pos/payment/status/${encodeURIComponent(paymentInvoice)}`,
            );

            const result = response.data;
            const status = String(
                response.data.transaction?.status ?? "",
            ).toLowerCase();

            if (status === "completed") {
                if (handleVerifiedPayment()) {
                    toast.success("Pembayaran berhasil ");
                }

                setReceipt({
                    lines: cartLines,
                    subtotal: Number(result.sale.subtotal),
                    tax: Number(result.sale.tax),
                    total: Number(result.sale.grand_total),
                    cash: Number(result.cash_received),
                    change: Number(result.change),
                    time: new Date(result.sale.transaction_date),
                    trxId: result.sale.invoice_number,
                    cashierName: result.sale.cashier_name,
                });

                router.reload({
                    only: ["products"],
                });

                return;
            }

            setShowPanelPayment(false);
            toast.info(
                "Kanal pembayaran ditutup, tetapi Xendit belum mengonfirmasi pembayaran. Transaksi tetap pending dan status akan diperiksa kembali.",
            );
        } catch (error) {
            console.error(
                "Gagal memverifikasi pembayaran POS ke Xendit:",
                error,
            );
            toast.error(
                "Pembayaran belum dapat diverifikasi. Transaksi tetap pending; status akan diperiksa kembali.",
            );
        }
    };

    const handleXenditSessionExpired = () => {
        setShowPaymentComponent(true);
        setShowPanelPayment(false);
        setHasRestoredPaymentAction(false);
        setXenditSdkKey(null);
        setXenditPaymentReady(false);
        toast.info(
            "Sesi pembayaran berakhir. Transaksi tetap pending; batalkan transaksi atau periksa status pembayaran.",
        );
    };

    useEffect(() => {
        if (!initialDraft?.invoiceNumber) return;

        const invoiceNumber = initialDraft.invoiceNumber;
        const handleOverlayClosed = (event: Event) => {
            const detail = (event as CustomEvent<{ invoiceNumber: string }>)
                .detail;
            if (detail?.invoiceNumber === invoiceNumber) {
                setShowPanelPayment(false);
            }
        };

        window.addEventListener(
            "pos-payment-action-closed",
            handleOverlayClosed,
        );

        return () => {
            window.removeEventListener(
                "pos-payment-action-closed",
                handleOverlayClosed,
            );
        };
    }, [initialDraft?.invoiceNumber]);

    useEffect(() => {
        const overlay = actionOverlayRef.current;
        if (!overlay) return;

        overlay.style.display = showPanelPayment ? "flex" : "none";
        if (showPanelPayment) {
            overlay.removeAttribute("aria-hidden");
            overlay.setAttribute("aria-modal", "true");
        } else {
            overlay.setAttribute("aria-hidden", "true");
            overlay.removeAttribute("aria-modal");
        }
    }, [showPanelPayment]);

    useEffect(() => {
        if (initialDraft) {
            toast.info(
                initialDraft.invoiceNumber
                    ? "Keranjang transaksi tertunda berhasil dipulihkan."
                    : "Draft transaksi sebelumnya berhasil dipulihkan.",
            );
        }
    }, []);

    useEffect(() => {
        if (!initialDraft?.invoiceNumber) return;

        let isActive = true;
        const invoiceNumber = initialDraft.invoiceNumber;

        const verifyPendingTransaction = async () => {
            try {
                const response = await axios.get(
                    `/pos/payment/status/${encodeURIComponent(invoiceNumber)}`,
                );
                const status = String(
                    response.data.transaction?.status ?? "",
                ).toLowerCase();

                if (!isActive) return;

                if (status === "pending") {
                    const existingActionOverlay =
                        findPaymentActionOverlay(invoiceNumber);

                    if (existingActionOverlay) {
                        actionOverlayRef.current = existingActionOverlay;
                        existingActionOverlay.style.display = "flex";
                        existingActionOverlay.removeAttribute("aria-hidden");
                        existingActionOverlay.setAttribute(
                            "aria-modal",
                            "true",
                        );
                        setHasRestoredPaymentAction(true);
                        setPaymentMethod(PAYMENT_METHOD.E_PAYMENT);
                        setShowPaymentComponent(true);
                        setShowPanelPayment(true);
                        toast.info(
                            `QR/VA transaksi ${invoiceNumber} yang sama berhasil ditampilkan kembali.`,
                        );
                        return;
                    }

                    const sessionResponse = await axios.get<{
                        components_sdk_key: string;
                    }>(
                        `/pos/payment/session-key/${encodeURIComponent(invoiceNumber)}`,
                    );

                    if (!isActive) return;

                    const componentsSdkKey =
                        sessionResponse.data.components_sdk_key;
                    if (!componentsSdkKey) {
                        throw new Error(
                            "Key sesi pembayaran Xendit tidak ditemukan.",
                        );
                    }

                    setPaymentMethod(PAYMENT_METHOD.E_PAYMENT);
                    setHasRestoredPaymentAction(false);
                    setXenditSdkKey(componentsSdkKey);
                    setShowPaymentComponent(true);
                    setShowPanelPayment(true);
                    toast.info(
                        `Sesi pembayaran ${invoiceNumber} dipulihkan. Pilih kembali channel QRIS/VA untuk melanjutkan; transaksi baru tidak dibuat.`,
                    );
                    return;
                }

                window.sessionStorage.removeItem(draftStorageKey);
                setPaymentInvoice(null);
                setHasCheckedOut(false);
                setHasRestoredPaymentAction(false);
                setCart({});
                setCash("");
                setPaymentMethod(PAYMENT_METHOD.CASH);
                toast.info(
                    status === "completed"
                        ? "Transaksi sudah berhasil dibayar dan tercatat di Sales."
                        : "Transaksi sebelumnya tidak lagi menunggu pembayaran.",
                );
            } catch (error) {
                console.error(
                    "Gagal memverifikasi transaksi POS yang dipulihkan:",
                    error,
                );
                if (isActive) {
                    toast.error(
                        "Status transaksi belum dapat diverifikasi. Keranjang dipulihkan dalam mode aman dan checkout ulang dinonaktifkan.",
                    );
                }
            } finally {
                if (isActive) setRestoringPaymentSession(false);
            }
        };

        void verifyPendingTransaction();

        return () => {
            isActive = false;
        };
    }, [initialDraft, draftStorageKey]);

    useEffect(() => {
        if (!paymentInvoice || !hasCheckedOut) return;

        let isActive = true;
        let isChecking = false;
        let hasReportedError = false;

        const verifyPaymentStatus = async () => {
            if (!isActive || isChecking) return;

            isChecking = true;
            try {
                const response = await axios.get(
                    `/pos/payment/status/${encodeURIComponent(paymentInvoice)}`,
                );
                if (!isActive) return;

                const status = String(
                    response.data.transaction?.status ?? "",
                ).toLowerCase();

                if (status === "completed") {
                    if (handleVerifiedPayment()) {
                        toast.success(
                            "Pembayaran berhasil dikonfirmasi Xendit.",
                        );
                    }
                }
            } catch (error) {
                console.error("Gagal memeriksa status pembayaran POS:", error);
                if (!hasReportedError && isActive) {
                    toast.error(
                        "Status pembayaran belum dapat diperiksa. POS akan mencoba kembali.",
                    );
                    hasReportedError = true;
                }
            } finally {
                isChecking = false;
            }
        };

        void verifyPaymentStatus();
        const interval = window.setInterval(verifyPaymentStatus, 5000);

        return () => {
            isActive = false;
            window.clearInterval(interval);
        };
    }, [paymentInvoice, hasCheckedOut]);

    useEffect(() => {
        try {
            if (Object.keys(cart).length === 0) {
                window.sessionStorage.removeItem(draftStorageKey);
                return;
            }

            if (hasCheckedOut && !paymentInvoice) {
                window.sessionStorage.removeItem(draftStorageKey);
                return;
            }

            window.sessionStorage.setItem(
                draftStorageKey,
                JSON.stringify({
                    version: POS_DRAFT_VERSION,
                    cart,
                    cash,
                    paymentMethod,
                    ...(hasCheckedOut &&
                        paymentInvoice && { invoiceNumber: paymentInvoice }),
                } satisfies POSDraft),
            );
            draftStorageErrorNotifiedRef.current = false;
        } catch (error) {
            console.error("Gagal menyimpan draft transaksi POS:", error);
            if (!draftStorageErrorNotifiedRef.current) {
                toast.error("Draft keranjang tidak dapat disimpan di browser.");
                draftStorageErrorNotifiedRef.current = true;
            }
        }
    }, [
        cart,
        cash,
        paymentMethod,
        hasCheckedOut,
        paymentInvoice,
        draftStorageKey,
    ]);

    const TAX_RATE = taxSetting?.percentage ? taxSetting.percentage / 100 : 0;

    // Daftar kategori diambil dinamis dari data produk (bukan dummy lagi)
    const CATEGORIES = useMemo<string[]>(() => {
        const unique = [
            ...new Set(
                (PRODUCTS ?? [])
                    .map((p) => p.categories?.name)
                    .filter((name): name is string => Boolean(name)),
            ),
        ];

        return ["Semua", ...unique];
    }, [PRODUCTS]);

    const cartLines = useMemo<POSCartLine[]>(() => {
        return Object.entries(cart)
            .map(([id, qty]) => {
                const product = PRODUCTS?.find((p) => p.id === Number(id));
                const quantity = Number(qty);

                if (!product || !Number.isFinite(quantity) || quantity <= 0) {
                    return null;
                }

                return {
                    ...product,
                    qty: quantity,
                    lineTotal: product.sell_price * quantity,
                };
            })
            .filter((line): line is NonNullable<typeof line> => line !== null);
    }, [cart, PRODUCTS]);

    const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const cashValue = Number(cash) || 0;
    const change = cashValue - total;
    const canPay =
        cartLines.length > 0 &&
        (paymentMethod === PAYMENT_METHOD.E_PAYMENT || cashValue >= total);

    const addToCart = (id: number) => {
        if (hasCheckedOut) return;

        const product = PRODUCTS?.find((item) => item.id === Number(id));
        if (!product) return;

        const stockQty = Number(product.inventory?.qty ?? 0);
        if ((cart[id] || 0) >= stockQty) {
            toast.error(
                stockQty > 0
                    ? `Jumlah ${product.name} sudah mencapai stok tersedia (${stockQty}).`
                    : `Stok ${product.name} sudah habis.`,
            );
            return;
        }

        setCart((prev) => {
            const currentQty = prev[id] || 0;
            if (currentQty >= stockQty) return prev;
            return { ...prev, [id]: currentQty + 1 };
        });
    };
    const decrement = (id: number) => {
        if (hasCheckedOut) return;

        setCart((prev) => {
            const next = { ...prev, [id]: (prev[id] || 0) - 1 };
            if (next[id] <= 0) delete next[id];
            return next;
        });
    };
    const removeLine = (id: number) => {
        if (hasCheckedOut) return;

        setCart((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handlePay = async () => {
        if (!canPay || processing) return;

        try {
            paymentCompletionHandledRef.current = false;
            setProcessing(true);

            const payload = {
                items: cartLines.map((item) => ({
                    product_id: item.id,
                    qty: item.qty,
                })),

                payment_method: paymentMethod,

                ...(paymentMethod === PAYMENT_METHOD.CASH && {
                    cash_received: cashValue,
                }),
            };

            console.log("CHECKOUT PAYLOAD:", payload);

            const response = await axios.post("/pos/checkout", payload);

            const result = response.data;

            console.log("CHECKOUT RESPONSE:", response);
            console.log("CHECKOUT DATA:", result);

            if (!result.success) {
                throw new Error(result.message || "Transaksi gagal.");
            }

            /*
      |--------------------------------------------------------------------------
      | E-PAYMENT
      |--------------------------------------------------------------------------
      */

            if (result.payment_method === PAYMENT_METHOD.E_PAYMENT) {
                setHasCheckedOut(true);
                setPaymentInvoice(result.sale.invoice_number);

                if (!result.components_sdk_key) {
                    throw new Error(
                        "Xendit Components SDK Key tidak ditemukan.",
                    );
                }

                setXenditSdkKey(result.components_sdk_key);
                setShowPaymentComponent(true);
                setShowPanelPayment(true);

                return;
            }

            /*
      |--------------------------------------------------------------------------
      | CASH
      |--------------------------------------------------------------------------
      */

            setHasCheckedOut(true);
            setPaymentInvoice(null);
            console.log("CASH CHECKOUT SUCCESS:", result);
            setReceipt({
                lines: cartLines,
                subtotal: Number(result.sale.subtotal),
                tax: Number(result.sale.tax),
                total: Number(result.sale.grand_total),
                cash: Number(result.cash_received),
                change: Number(result.change),
                time: new Date(result.sale.transaction_date),
                trxId: result.sale.invoice_number,
                cashierName: result.sale.cashier_name,
            });

            // refresh data product setelah CASH
            router.reload({
                only: ["products"],
            });
        } catch (error: unknown) {
            console.error("Checkout error:", error);

            const err = error as {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
                message?: string;
            };

            const message =
                err.response?.data?.message ||
                err.message ||
                "Terjadi kesalahan saat melakukan pembayaran.";

            alert(message);
        } finally {
            setProcessing(false);
        }
    };

    const newTransaction = () => {
        paymentCompletionHandledRef.current = false;
        setHasCheckedOut(false);
        setCart({});
        setCash("");
        setReceipt(null);
        setProcessing(false);
        setShowPanelPayment(false);
        setPaymentInvoice(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} balance={balance}>
            <Head title="Cashier" />

            <div
                ref={posContainerRef}
                className={`${
                    isMaximized
                        ? "h-[100dvh] w-screen"
                        : "h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] w-full"
                } overflow-hidden bg-[#F7F3E8] text-[#1C2A22] flex flex-col font-sans`}
            >
                <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                    <ProductCatalog
                        isMaximized={isMaximized}
                        onFullscreenToggle={handleFullscreenToggle}
                        products={PRODUCTS ?? []}
                        categories={CATEGORIES}
                        category={category}
                        query={query}
                        cart={cart}
                        hasCheckedOut={hasCheckedOut}
                        onCategoryChange={setCategory}
                        onQueryChange={setQuery}
                        onAddToCart={addToCart}
                        formatCurrency={rupiah}
                    />
                    <CheckoutAside
                        receipt={receipt}
                        onNewTransaction={newTransaction}
                        hasCheckedOut={hasCheckedOut}
                        paymentInvoice={paymentInvoice}
                        hasRestoredPaymentAction={hasRestoredPaymentAction}
                        cancellingPayment={cancellingPayment}
                        onCancelPendingPayment={handleCancelPendingPayment}
                        cartLines={cartLines}
                        onDecrement={decrement}
                        onAddToCart={addToCart}
                        onRemoveLine={removeLine}
                        subtotal={subtotal}
                        taxSetting={taxSetting}
                        tax={tax}
                        total={total}
                        paymentMethod={paymentMethod}
                        onPaymentMethodChange={setPaymentMethod}
                        cash={cash}
                        onCashChange={setCash}
                        change={change}
                        showPaymentComponent={showPaymentComponent}
                        showPanelPayment={showPanelPayment}
                        onShowPanelPaymentChange={setShowPanelPayment}
                        restoringPaymentSession={restoringPaymentSession}
                        xenditPaymentReady={xenditPaymentReady}
                        xenditSubmitting={xenditSubmitting}
                        xenditComponents={xenditComponents}
                        onPay={handlePay}
                        canPay={canPay}
                        processing={processing}
                        formatCurrency={rupiah}
                        xenditPayment={
                            <XenditPayment
                                sdkKey={xenditSdkKey}
                                paymentInvoice={paymentInvoice}
                                showPanelPayment={showPanelPayment}
                                onComponentsChange={setXenditComponents}
                                onPaymentReadyChange={setXenditPaymentReady}
                                onSubmittingChange={setXenditSubmitting}
                                onPanelClose={() => setShowPanelPayment(false)}
                                onSwitchPaymentMethod={
                                    handleSwitchPaymentMethod
                                }
                                onSessionComplete={handleXenditSessionComplete}
                                onSessionExpired={handleXenditSessionExpired}
                                onOverlayChange={(overlay, cleanup) => {
                                    actionOverlayRef.current = overlay;
                                    cleanupXenditActionRef.current = cleanup;
                                }}
                            />
                        }
                    />
                </div>
            </div>
        </AppLayout>
    );
}
