import { useEffect, useRef } from "react";
import { XenditComponents } from "xendit-components-web";
import { toast } from "sonner";

interface XenditPaymentProps {
    sdkKey: string | null;
    paymentInvoice: string | null;
    showPanelPayment: boolean;
    onComponentsChange: (components: XenditComponents | null) => void;
    onPaymentReadyChange: (ready: boolean) => void;
    onSubmittingChange: (submitting: boolean) => void;
    onPanelClose: () => void;
    onSwitchPaymentMethod: (components: XenditComponents) => void;
    onSessionComplete: () => void;
    onSessionExpired: () => void;
    onOverlayChange: (
        overlay: HTMLDivElement | null,
        cleanup: (() => void) | null,
    ) => void;
}

export default function XenditPayment({
    sdkKey,
    paymentInvoice,
    showPanelPayment,
    onComponentsChange,
    onPaymentReadyChange,
    onSubmittingChange,
    onPanelClose,
    onSwitchPaymentMethod,
    onSessionComplete,
    onSessionExpired,
    onOverlayChange,
}: XenditPaymentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const actionOverlayRef = useRef<HTMLDivElement | null>(null);
    const callbacksRef = useRef({
        onComponentsChange,
        onPaymentReadyChange,
        onSubmittingChange,
        onPanelClose,
        onSwitchPaymentMethod,
        onSessionComplete,
        onSessionExpired,
        onOverlayChange,
    });

    callbacksRef.current = {
        onComponentsChange,
        onPaymentReadyChange,
        onSubmittingChange,
        onPanelClose,
        onSwitchPaymentMethod,
        onSessionComplete,
        onSessionExpired,
        onOverlayChange,
    };

    useEffect(() => {
        if (!sdkKey) return;

        let components: XenditComponents;
        let actionOverlay: HTMLDivElement | null = null;
        let actionContainer: HTMLElement | null = null;

        try {
            components = new XenditComponents({
                componentsSdkKey: sdkKey,
            });
        } catch (error) {
            console.error("Xendit Components Error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Gagal memuat pembayaran Xendit.",
            );
            return;
        }

        const removeActionOverlay = () => {
            const component = actionContainer;
            const overlay = actionOverlay;

            actionContainer = null;
            actionOverlay = null;
            if (actionOverlayRef.current === overlay) {
                actionOverlayRef.current = null;
            }
            callbacksRef.current.onOverlayChange(null, null);

            try {
                if (component) {
                    components.destroyComponent(component);
                }
            } finally {
                overlay?.remove();
            }
        };

        const handleInit = () => {
            console.log("XENDIT COMPONENTS INITIALIZED");

            const channels = components.getActiveChannels();
            console.log("XENDIT CHANNELS:", channels);

            if (!channels.length) {
                console.error("Tidak ada payment channel Xendit.");
                toast.error("Tidak ada payment channel Xendit.");
                return;
            }

            const container = containerRef.current;
            if (!container) {
                console.error("Container pembayaran Xendit tidak ditemukan.");
                toast.error("Container pembayaran Xendit tidak ditemukan.");
                return;
            }

            container.replaceChildren(
                components.createChannelPickerComponent(),
            );
            console.log("XENDIT CHANNEL PICKER MOUNTED");
        };

        components.addEventListener("init", handleInit);
        components.addEventListener("submission-ready", () => {
            console.log("XENDIT SUBMISSION READY");
            callbacksRef.current.onPaymentReadyChange(true);
        });
        components.addEventListener("submission-not-ready", () => {
            console.log("XENDIT SUBMISSION NOT READY");
            callbacksRef.current.onPaymentReadyChange(false);
        });
        components.addEventListener("session-complete", () => {
            console.log("XENDIT PAYMENT SUCCESS");
            removeActionOverlay();
            callbacksRef.current.onSessionComplete();
        });
        components.addEventListener("session-expired-or-canceled", () => {
            console.log("XENDIT PAYMENT EXPIRED/CANCELED");
            removeActionOverlay();
            callbacksRef.current.onSessionExpired();
        });
        components.addEventListener("submission-begin", () => {
            console.log("XENDIT SUBMISSION BEGIN");
            callbacksRef.current.onSubmittingChange(true);
        });
        components.addEventListener("submission-end", () => {
            console.log("XENDIT SUBMISSION END");
            callbacksRef.current.onSubmittingChange(false);
        });
        components.addEventListener("action-begin", () => {
            console.log("XENDIT ACTION BEGIN");
            removeActionOverlay();

            const overlay = document.createElement("div");
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");
            overlay.setAttribute(
                "aria-label",
                "Instruksi pembayaran Xendit",
            );
            if (paymentInvoice) {
                overlay.dataset.posPaymentInvoice = paymentInvoice;
            }
            Object.assign(overlay.style, {
                position: "fixed",
                inset: "0",
                zIndex: "9999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflowY: "auto",
                padding: "16px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
            });

            const action = components.createActionContainerComponent({
                withCard: true,
            });
            const panel = document.createElement("div");
            Object.assign(panel.style, {
                width: "100%",
                maxWidth: "420px",
                maxHeight: "calc(100dvh - 32px)",
                overflowY: "auto",
                borderRadius: "12px",
                padding: "16px",
                boxSizing: "border-box",
                backgroundColor: "#fff",
            });
            Object.assign(action.style, {
                display: "block",
                width: "100%",
                maxWidth: "100%",
            });
            panel.append(action);

            const changeMethodButton = document.createElement("button");
            changeMethodButton.type = "button";
            changeMethodButton.textContent = "Ganti metode QRIS / VA";
            changeMethodButton.className =
                "mt-3 w-full rounded-lg border border-[#D9D2BF] bg-white px-4 py-2 text-sm font-semibold text-[#132621] hover:bg-[#F7F3E8]";
            changeMethodButton.addEventListener("click", () => {
                callbacksRef.current.onSwitchPaymentMethod(components);
            });
            panel.append(changeMethodButton);
            overlay.append(panel);
            overlay.addEventListener("click", (event) => {
                if (event.target !== overlay) return;

                overlay.style.display = "none";
                overlay.setAttribute("aria-hidden", "true");
                overlay.removeAttribute("aria-modal");
                callbacksRef.current.onPanelClose();
                if (paymentInvoice) {
                    window.dispatchEvent(
                        new CustomEvent("pos-payment-action-closed", {
                            detail: { invoiceNumber: paymentInvoice },
                        }),
                    );
                }
                toast.info(
                    "Tampilan QR ditutup, tetapi status pembayaran masih aktif. Pastikan statusnya sebelum memulai pembayaran lain.",
                );
            });
            document.body.append(overlay);

            actionOverlay = overlay;
            actionOverlayRef.current = overlay;
            actionContainer = action;
            callbacksRef.current.onOverlayChange(
                overlay,
                removeActionOverlay,
            );
        });
        components.addEventListener("action-end", () => {
            console.log("XENDIT ACTION END");
            removeActionOverlay();
        });
        components.addEventListener("fatal-error", (error) => {
            console.error("XENDIT FATAL ERROR:", error);
            removeActionOverlay();
        });

        callbacksRef.current.onComponentsChange(components);

        return () => {
            removeActionOverlay();
            containerRef.current?.replaceChildren();
            callbacksRef.current.onComponentsChange(null);
        };
    }, [sdkKey, paymentInvoice]);

    useEffect(() => {
        const overlay = actionOverlayRef.current;
        if (!overlay) {
            return;
        }

        overlay.style.display = showPanelPayment ? "flex" : "none";
        if (showPanelPayment) {
            overlay.removeAttribute("aria-hidden");
            overlay.setAttribute("aria-modal", "true");
        } else {
            overlay.setAttribute("aria-hidden", "true");
            overlay.removeAttribute("aria-modal");
        }
    }, [showPanelPayment, paymentInvoice]);

    return (
        <div
            className={`border border-[#D9D2BF] rounded-lg m-auto ${
                showPanelPayment ? "" : "hidden"
            }`}
        >
            <div ref={containerRef} className="w-full" />
        </div>
    );
}
