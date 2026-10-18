<<<<<<< Updated upstream
import { useState, useMemo, useEffect, useRef } from "react";
=======
import React from "react";
import { useState, useMemo, useEffect } from "react";
>>>>>>> Stashed changes
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { usePage, router } from "@inertiajs/react";
import { XenditComponents } from "xendit-components-web";
import { toast } from "sonner";
import type { ReceiptData } from "@/Pages/POS/ReceiptView";
import axios from "axios";
import { ProductProps, TaxSettingForm, type BreadcrumbItem } from "@/types";
import {
<<<<<<< Updated upstream
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
=======
    Plus,
    Minus,
    Trash2,
    Search,
    Receipt,
    X,
    CheckCircle2,
    RotateCcw,
    Wallet,
} from "lucide-react";

enum PaymentMethodEnum {
    CASH = "CASH",
    E_PAYMENT = "E-PAYMENT",
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "POS / Point Of Sales / Cashier",
>>>>>>> Stashed changes
        href: "/pos",
    },
];

const POS_DRAFT_VERSION = 1;
const PAYMENT_METHOD = {
    CASH: "CASH",
    E_PAYMENT: "E-PAYMENT",
} as const;

<<<<<<< Updated upstream
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
=======
const rupiah = (n) =>
    "Rp" +
    Number(n).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

const rupiahFormatterNumberInput = (n) =>
>>>>>>> Stashed changes
    "Rp" +
    Number(n).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

export default function index({ taxSetting }: { taxSetting: TaxSettingForm }) {
<<<<<<< Updated upstream
    const page = usePage<SharedData & { products: { data: ProductProps[] } }>();
    const { data: PRODUCTS } = page.props.products;
    const draftStorageKey = `pos-draft:v${POS_DRAFT_VERSION}:${page.props.auth.user.id}`;
    const [initialDraft] = useState(() => loadPOSDraft(draftStorageKey));
    const [isMaximized, setIsMaximized] = useState(false);
    const posContainerRef = useRef<HTMLDivElement>(null);
    const [xenditSdkKey, setXenditSdkKey] = useState<string | null>(null);
    const [paymentInvoice, setPaymentInvoice] = useState<string | null>(
        () => initialDraft?.invoiceNumber ?? null,
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

    const handleXenditSessionComplete = () => {
        setShowPaymentComponent(false);
        setShowPanelPayment(false);
        setHasRestoredPaymentAction(false);
        setXenditSdkKey(null);
        setPaymentInvoice(null);
        setXenditPaymentReady(false);
        try {
            window.sessionStorage.removeItem(draftStorageKey);
        } catch (storageError) {
            console.error(
                "Gagal menghapus draft setelah pembayaran selesai:",
                storageError,
            );
        }

        router.reload({
            only: ["products"],
        });
    };

    const handleXenditSessionExpired = () => {
        setShowPaymentComponent(false);
        setShowPanelPayment(false);
        setHasRestoredPaymentAction(false);
        setXenditSdkKey(null);
        setXenditPaymentReady(false);
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

=======
    const mountXenditPayment = async (sdkKey: string) => {
        try {
            const components = new XenditComponents({
                componentsSdkKey: sdkKey,
            });

            const container = document.getElementById(
                "xendit-payment-container",
            );

            if (!container) {
                throw new Error("Container pembayaran Xendit tidak ditemukan.");
            }

            const handleInit = () => {
                console.log("XENDIT COMPONENTS INITIALIZED");

                const channels = components.getActiveChannels();

                console.log("XENDIT CHANNELS:", channels);

                if (!channels.length) {
                    throw new Error("Tidak ada payment channel Xendit.");
                }

                // Buat channel picker
                const channelPicker = components.createChannelPickerComponent();

                container.replaceChildren(channelPicker);

                console.log("XENDIT CHANNEL PICKER MOUNTED");
            };

            components.addEventListener("init", handleInit);

            // ============================
            // PAYMENT READY
            // ============================

            components.addEventListener("submission-ready", () => {
                console.log("XENDIT SUBMISSION READY");

                setXenditPaymentReady(true);
            });

            components.addEventListener("submission-not-ready", () => {
                console.log("XENDIT SUBMISSION NOT READY");

                setXenditPaymentReady(false);
            });

            // ============================
            // PAYMENT SUCCESS
            // ============================

            components.addEventListener("session-complete", () => {
                console.log("XENDIT PAYMENT SUCCESS");

                setShowPaymentComponent(false);
                setXenditSdkKey(null);
                setXenditPaymentReady(false);
                toast.success("asdasdasdasdasdasdasdasdasdsa");

                router.reload({
                    only: ["products"],
                });
            });

            // ============================
            // PAYMENT CANCEL / EXPIRED
            // ============================

            components.addEventListener("session-expired-or-canceled", () => {
                console.log("XENDIT PAYMENT EXPIRED/CANCELED");

                setShowPaymentComponent(false);
                setXenditSdkKey(null);
                setXenditPaymentReady(false);
            });

            // ============================
            // SUBMISSION
            // ============================

            components.addEventListener("submission-begin", () => {
                console.log("XENDIT SUBMISSION BEGIN");

                setXenditSubmitting(true);
            });

            components.addEventListener("submission-end", () => {
                console.log("XENDIT SUBMISSION END");

                setXenditSubmitting(false);
            });

            // ============================
            // ACTION
            // ============================

            components.addEventListener("action-begin", () => {
                console.log("XENDIT ACTION BEGIN");
            });

            components.addEventListener("action-end", () => {
                console.log("XENDIT ACTION END");
            });

            components.addEventListener("fatal-error", (error) => {
                console.error("XENDIT FATAL ERROR:", error);
            });

            // Simpan instance components supaya
            // tombol Bayar bisa memanggil submit()
            setXenditComponents(components);
        } catch (error: any) {
            console.error("Xendit Components Error:", error);

            alert(error?.message || "Gagal memuat pembayaran Xendit.");
        }
    };
    // paginate() response dari backend: { data, links, meta }
    const { data: PRODUCTS } = usePage().props.products as {
        data: ProductProps[];
    };

    const [xenditSdkKey, setXenditSdkKey] = useState(null);
    const [showPaymentComponent, setShowPaymentComponent] = useState(false);

    const [xenditComponents, setXenditComponents] = useState<any>(null);

    const [xenditPaymentReady, setXenditPaymentReady] = useState(false);

    const [xenditSubmitting, setXenditSubmitting] = useState(false);

    useEffect(() => {
        if (!showPaymentComponent || !xenditSdkKey) {
            return;
        }

        mountXenditPayment(xenditSdkKey);
    }, [showPaymentComponent, xenditSdkKey]);

    const [category, setCategory] = useState("Semua");
    const [query, setQuery] = useState("");
    const [cart, setCart] = useState({});
    const [cash, setCash] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [processing, setProcessing] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(
        PaymentMethodEnum.CASH,
    );

    const TAX_RATE = taxSetting?.percentage ? taxSetting.percentage / 100 : 0;
    // const TAX__RATE_INCLUSIVE = taxSetting?.percentage - PRODUCTS?.map();

    // paymentMethodEnum

    // Daftar kategori diambil dinamis dari data produk (bukan dummy lagi)
    const CATEGORIES = useMemo(() => {
        const unique = [
            ...new Set(
                PRODUCTS?.map((p) => p.categories?.name).filter(Boolean),
            ),
        ];
        return ["Semua", ...unique];
    }, [PRODUCTS]);

    const filtered = useMemo(() => {
        return (PRODUCTS || []).filter((p) => {
            const inCat =
                category === "Semua" || p.categories?.name === category;
            const inQuery = p.name.toLowerCase().includes(query.toLowerCase());
            return inCat && inQuery;
        });
    }, [category, query, PRODUCTS]);

    const cartLines = useMemo(() => {
        return Object.entries(cart)
            .map(([id, qty]) => {
                const product = PRODUCTS?.find((p) => p.id === Number(id));
                if (!product || qty <= 0) return null;
                return { ...product, qty, lineTotal: product.sell_price * qty };
            })
            .filter(Boolean);
    }, [cart, PRODUCTS]);

    const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const cashValue = Number(cash) || 0;
    const change = cashValue - total;
    // const canPay = cartLines.length > 0 && cashValue >= total;
    const canPay =
        cartLines.length > 0 &&
        (paymentMethod === "E-PAYMENT" || cashValue >= total);

    const addToCart = (id) => {
        setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };
    const decrement = (id) => {
        setCart((prev) => {
            const next = { ...prev, [id]: (prev[id] || 0) - 1 };
            if (next[id] <= 0) delete next[id];
            return next;
        });
    };
    const removeLine = (id) => {
        setCart((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    // const handlePay = () => {
    //   if (!canPay) return;
    //   setReceipt({
    //     lines: cartLines,
    //     subtotal,
    //     tax,
    //     total,
    //     cash: cashValue,
    //     change,
    //     time: new Date(),
    //     trxId: "TRX-" + Math.floor(100000 + Math.random() * 900000),
    //   });
    // };

    const handlePay = async () => {
        if (!canPay || processing) return;

        try {
            setProcessing(true);

            const payload = {
                items: cartLines.map((item) => ({
                    product_id: item.id,
                    qty: item.qty,
                })),

                payment_method: paymentMethod,

                ...(paymentMethod === "CASH" && {
                    cash_received: cashValue,
                }),
            };

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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

=======
            if (result.payment_method === "E-PAYMENT") {
                if (!result.components_sdk_key) {
                    throw new Error(
                        "Xendit Components SDK Key tidak ditemukan.",
                    );
                }

                setXenditSdkKey(result.components_sdk_key);
                setShowPaymentComponent(true);

                return;
            }

>>>>>>> Stashed changes
            /*
      |--------------------------------------------------------------------------
      | CASH
      |--------------------------------------------------------------------------
      */

<<<<<<< Updated upstream
            setHasCheckedOut(true);
            setPaymentInvoice(null);
            console.log("CASH CHECKOUT SUCCESS:", result);
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
        setHasCheckedOut(false);
        setCart({});
        setCash("");
        setReceipt(null);
        setProcessing(false);
        setShowPanelPayment(false);
        setPaymentInvoice(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
=======
        } catch (error) {
            console.error("Checkout error:", error);

            const message =
                error.response?.data?.message ||
                error.message ||
                "Terjadi kesalahan saat melakukan pembayaran.";

            alert(message);
        } finally {
            setProcessing(false);
        }
    };

    const newTransaction = () => {
        setCart({});
        setCash("");
        setReceipt(null);
        setProcessing(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="POS INI BOSSZ" />

            <div className="min-h-screen w-full bg-[#F7F3E8] text-[#1C2A22] flex flex-col font-sans">
                <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                    {/* Katalog produk */}
                    <main className="flex-1 p-5 flex flex-col min-h-0">
                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C82]" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari menu..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9D2BF] bg-white text-sm placeholder:text-[#A3AFA6] focus:outline-none focus:ring-2 focus:ring-[#E3A23C]"
                            />
                        </div>

                        {/* Kategori */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {CATEGORIES.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        category === c
                                            ? "bg-[#132621] text-white"
                                            : "bg-white text-[#5A6B60] border border-[#D9D2BF] hover:border-[#132621]"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* Grid produk */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-1">
                            {filtered.map((p) => {
                                const qtyInCart = cart[p.id] || 0;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => addToCart(p.id)}
                                        className={`relative text-left bg-white border rounded-xl p-3.5 active:scale-[0.97] transition-transform ${
                                            qtyInCart > 0
                                                ? "border-[#E3A23C] ring-1 ring-[#E3A23C]"
                                                : "border-[#D9D2BF]"
                                        }`}
                                    >
                                        {qtyInCart > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-[#E3A23C] text-[#132621] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                                                {qtyInCart}
                                            </span>
                                        )}
                                        <p className="text-xs text-[#7C8C82] mb-1">
                                            {p.categories?.name}
                                        </p>
                                        <p className="font-medium text-sm leading-snug mb-2">
                                            {p.name}
                                        </p>
                                        <p className="font-mono text-sm leading-snug mb-2">
                                            Stock : {p.inventory?.qty}
                                        </p>
                                        <p className="font-mono text-sm font-semibold text-[#132621]">
                                            {rupiah(p.sell_price)}
                                        </p>
                                    </button>
                                );
                            })}
                            {filtered.length === 0 && (
                                <p className="col-span-full text-center text-sm text-[#7C8C82] py-10">
                                    Menu tidak ditemukan.
                                </p>
                            )}
                        </div>
                    </main>

                    {/* Panel struk / kasir */}
                    <aside className="w-full lg:w-[380px] bg-white border-t lg:border-t-0 lg:border-l border-[#D9D2BF] flex flex-col min-h-0">
                        {receipt ? (
                            <ReceiptView
                                receipt={receipt}
                                onNew={newTransaction}
                            />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#D9D2BF]">
                                    <Receipt className="w-4 h-4 text-[#7C8C82]" />
                                    <h2 className="font-semibold text-sm">
                                        Pesanan Saat Ini
                                    </h2>
                                    <h2 className="font-semibold text-sm">
                                        Total Token :{" "}
                                    </h2>
                                </div>

                                <div className="flex-1 overflow-y-auto px-5 py-3">
                                    {cartLines.length === 0 ? (
                                        <p className="text-sm text-[#7C8C82] text-center py-10">
                                            Belum ada item. Ketuk menu untuk
                                            menambahkan.
                                        </p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {cartLines.map((l) => (
                                                <li
                                                    key={l.id}
                                                    className="flex items-start justify-between gap-2"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {l.name}
                                                        </p>
                                                        <p className="text-xs text-[#7C8C82] font-mono">
                                                            {rupiah(
                                                                l?.sell_price,
                                                            )}{" "}
                                                            x {l.qty}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            onClick={() =>
                                                                decrement(l.id)
                                                            }
                                                            className="w-6 h-6 rounded-md border border-[#D9D2BF] flex items-center justify-center hover:bg-[#F7F3E8]"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm w-4 text-center font-mono">
                                                            {l.qty}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                addToCart(l.id)
                                                            }
                                                            className="w-6 h-6 rounded-md border border-[#D9D2BF] flex items-center justify-center hover:bg-[#F7F3E8]"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                removeLine(l.id)
                                                            }
                                                            className="w-6 h-6 rounded-md flex items-center justify-center text-[#B54A3F] hover:bg-[#F7ECEA] ml-1"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Ringkasan & pembayaran */}
                                <div className="border-t border-[#D9D2BF] px-5 py-4 space-y-3">
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between text-[#5A6B60]">
                                            <span>Subtotal</span>
                                            <span className="font-mono">
                                                {rupiah(subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[#5A6B60]">
                                            <span>
                                                Pajak ({taxSetting?.percentage}
                                                %)
                                            </span>
                                            {/* <span>Pajak {{ (taxSetting) }}%</span> */}
                                            <span className="font-mono">
                                                {rupiah(tax)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#132621] rounded-lg px-4 py-3 flex items-center justify-between">
                                        <span className="text-xs text-[#9CB3A8] uppercase tracking-wide">
                                            Total
                                        </span>
                                        <span className="font-mono text-xl font-semibold text-[#F2B24E]">
                                            {rupiah(total)}
                                        </span>
                                    </div>

                                    <div>
                                        <label htmlFor="">Payment Method</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {PAYMENT_METHOD.map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => {
                                                        setPaymentMethod(
                                                            method,
                                                        );

                                                        // Kalau pindah ke E-PAYMENT,
                                                        // cash tidak perlu dipakai
                                                        if (
                                                            method ===
                                                            "E-PAYMENT"
                                                        ) {
                                                            setCash("");
                                                        }
                                                    }}
                                                    className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
                                                        paymentMethod === method
                                                            ? "bg-[#132621] text-white border-[#132621]"
                                                            : "bg-[#F7F3E8] text-[#5A6B60] border-[#D9D2BF] hover:border-[#E3A23C]"
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {paymentMethod === "CASH" && (
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
                                                            : rupiah(cash)
                                                    }
                                                    onChange={(e) => {
                                                        const raw =
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                "",
                                                            ); // buang "Rp", titik, dll
                                                        setCash(raw);
                                                    }}
                                                    placeholder="Rp0"
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9D2BF] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#E3A23C]"
                                                />
                                            </div>
                                            <div className="flex gap-1.5 mt-2 flex-wrap">
                                                {QUICK_CASH.map((v) => (
                                                    <button
                                                        key={v}
                                                        onClick={() =>
                                                            setCash(String(v))
                                                        }
                                                        className="px-2.5 py-1 rounded-md bg-[#F7F3E8] border border-[#D9D2BF] text-xs font-mono hover:border-[#E3A23C]"
                                                    >
                                                        {rupiah(v)}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() =>
                                                        setCash(String(total))
                                                    }
                                                    className="px-2.5 py-1 rounded-md bg-[#F7F3E8] border border-[#D9D2BF] text-xs font-mono hover:border-[#E3A23C]"
                                                >
                                                    Uang pas
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "CASH" &&
                                        cash !== "" && (
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
                                                    {change < 0
                                                        ? "Kurang "
                                                        : ""}
                                                    {rupiah(Math.abs(change))}
                                                </span>
                                            </div>
                                        )}

                                    {showPaymentComponent &&
                                        paymentMethod === "E-PAYMENT" && (
                                            <>
                                                <div className="mt-3 border border-[#D9D2BF] rounded-lg p-3 bg-white">
                                                    <div
                                                        id="xendit-payment-container"
                                                        className="w-full"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!xenditComponents) {
                                                            alert(
                                                                "Xendit belum siap.",
                                                            );
                                                            return;
                                                        }

                                                        if (
                                                            !xenditPaymentReady
                                                        ) {
                                                            xenditComponents.showValidationErrors();
                                                            return;
                                                        }

                                                        xenditComponents.submit();
                                                    }}
                                                    disabled={
                                                        !xenditPaymentReady ||
                                                        xenditSubmitting
                                                    }
                                                    className="w-full py-3 rounded-lg font-semibold text-sm transition-colors disabled:bg-[#E3DFD2] disabled:text-[#A3AFA6] bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                                                >
                                                    {xenditSubmitting
                                                        ? "Memproses Pembayaran..."
                                                        : "Bayar Sekarang"}
                                                </button>
                                            </>
                                        )}

                                    {/* <button
                    onClick={handlePay}
                    disabled={!canPay || processing}
                    className="w-full py-3 rounded-lg font-semibold text-sm transition-colors disabled:bg-[#E3DFD2] disabled:text-[#A3AFA6] bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                  >
                    {processing ? "Memproses..." : "Bayar"}
                  </button> */}

                                    {!showPaymentComponent && (
                                        <button
                                            onClick={handlePay}
                                            disabled={!canPay || processing}
                                            className="w-full py-3 rounded-lg font-semibold text-sm transition-colors disabled:bg-[#E3DFD2] disabled:text-[#A3AFA6] bg-[#E3A23C] text-[#132621] hover:bg-[#D6922F]"
                                        >
                                            {processing
                                                ? "Memproses..."
                                                : "Bayar"}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

function paymentMethod({ paymentMethod }) {
    return <div>asdada</div>;
}

function ReceiptView({ receipt, onNew }) {
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
                        <span>Pajak ({taxSetting?.percentage}%)</span>
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
                    className="w-full py-3 rounded-lg font-semibold text-sm bg-[#132621] text-white hover:bg-[#0D1D19] flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Transaksi Baru
                </button>
            </div>
        </div>
>>>>>>> Stashed changes
    );
}
