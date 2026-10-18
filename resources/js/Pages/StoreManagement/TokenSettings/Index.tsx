import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartLegend } from "@/components/ui/pixelact-ui/chart";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const PRICE_PER_TOKEN = 120;
const MIN_TOKENS = 42;
const PACKAGES = [100, 500, 1000, 5000];

declare global {
    interface Window {
        snap?: {
            embed: (
                token: string,
                options: {
                    embedId: string;
                    onSuccess?: (result: unknown) => void;
                    onPending?: (result: unknown) => void;
                    onError?: (result: unknown) => void;
                    onClose?: () => void;
                },
            ) => void;
        };
    }
}

const rupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);

export default function Index({
    MidtransClientKey,
    TokenValid,
}: {
    MidtransClientKey: string;
    TokenValid: any;
}) {
    console.log("ini token dari be", TokenValid);
    const [TokenReady, setTokenReady] = useState<any | null>(null);
    const [snapReady, setSnapReady] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

    const [snapToken, setSnapToken] = useState<string | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Token Settings", href: "/storeManagement/tokenSettings" },
    ];

    const { data, setData } = useForm({ tokens: 500 });

    const tokens = Number(data.tokens) || 0;
    const total = tokens * PRICE_PER_TOKEN;
    const invalid = tokens < MIN_TOKENS;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (invalid || paymentLoading) return;

        setPaymentLoading(true);
        setPaymentError(null);
        setPaymentMessage(null);
        setSnapToken(null);

        try {
            const response = await axios.post("/storeManagement/topup", {
                tokens,
            });

            if (!response.data.snapToken) {
                throw new Error("Snap Token tidak ditemukan dalam response.");
            }

            setSnapToken(response.data.snapToken);
        } catch (error) {
            console.error("Gagal membuat transaksi:", error);

            setPaymentError(
                "Gagal membuat transaksi top-up. Silakan coba kembali.",
            );
        } finally {
            setPaymentLoading(false);
        }
    };

    // Load Midtrans Snap SDK
    useEffect(() => {
        if (!MidtransClientKey) {
            setPaymentError("Midtrans Client Key belum tersedia.");
            return;
        }

        if (window.snap) {
            setSnapReady(true);
            return;
        }

        const script = document.createElement("script");

        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", MidtransClientKey);
        script.async = true;

        script.onload = () => {
            if (window.snap) {
                setSnapReady(true);
            } else {
                setPaymentError("Midtrans Snap SDK gagal dimuat.");
            }
        };

        script.onerror = () => {
            setPaymentError("Gagal memuat Midtrans Snap SDK.");
        };

        document.body.appendChild(script);
    }, [MidtransClientKey]);

    // Tampilkan pembayaran di dalam halaman
    useEffect(() => {
        if (!snapToken || !snapReady || !window.snap) return;

        window.snap.embed(snapToken, {
            embedId: "snap-container",

            onSuccess: () => {
                setPaymentMessage(null);
                toast.success("Pembayaran berhasil diproses. Terima kasih!");
                router.reload({ only: ["TokenValid"] });
                // setTokenReady(TokenValid);
                setSnapToken(null);
            },

            onPending: () => {
                setPaymentMessage("Pembayaran masih menunggu penyelesaian.");
                setSnapToken(null);
            },

            onError: () => {
                setPaymentError(
                    "Pembayaran gagal diproses. Silakan coba kembali.",
                );
                setSnapToken(null);
            },

            onClose: () => {
                setPaymentMessage(
                    "Form pembayaran ditutup. Status transaksi tetap perlu diperiksa.",
                );
                setSnapToken(null);
            },
        });
    }, [snapToken, snapReady, TokenValid]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Token Settings" />

            <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Top Up Token</h1>
                    <p className="text-muted-foreground text-sm">
                        1 token = {rupiah(PRICE_PER_TOKEN)}
                    </p>
                </div>

                <form onSubmit={submit} className="grid gap-6 md:grid-cols-5">
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Pilih jumlah token</CardTitle>
                            <CardDescription>
                                Pilih paket atau isi jumlah sendiri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                {PACKAGES.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setData("tokens", p)}
                                        className={`rounded-lg border p-3 text-left transition ${
                                            tokens === p
                                                ? "border-primary bg-primary/5 ring-primary ring-1"
                                                : "hover:bg-muted"
                                        }`}
                                    >
                                        <div className="font-semibold">
                                            {p.toLocaleString("id-ID")} token
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            {rupiah(p * PRICE_PER_TOKEN)}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tokens">
                                    Jumlah token (custom)
                                </Label>
                                <Input
                                    id="tokens"
                                    type="number"
                                    min={MIN_TOKENS}
                                    step={1}
                                    value={data.tokens || ""}
                                    onChange={(e) =>
                                        setData(
                                            "tokens",
                                            Math.floor(Number(e.target.value)),
                                        )
                                    }
                                    placeholder={`Minimal ${MIN_TOKENS}`}
                                />
                                {invalid && (
                                    <p className="text-sm text-red-500">
                                        Minimal top up {MIN_TOKENS} token (
                                        {rupiah(MIN_TOKENS * PRICE_PER_TOKEN)}).
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                Jumlah Token yang dimiliki sekarang:{" "}
                                {TokenValid || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardHeader>
                            <CardTitle>Ringkasan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Jumlah token
                                </span>
                                <span>{tokens.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Harga / token
                                </span>
                                <span>{rupiah(PRICE_PER_TOKEN)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-3 text-base font-semibold">
                                <span>Total bayar</span>
                                <span>{rupiah(invalid ? 0 : total)}</span>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={invalid || paymentLoading}
                            >
                                {paymentLoading
                                    ? "Memproses..."
                                    : "Bayar Sekarang"}
                            </Button>
                        </CardContent>
                    </Card>
                </form>

                {paymentError && (
                    <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                        {paymentError}
                    </div>
                )}

                {paymentMessage && (
                    <div className="rounded-lg border p-3 text-sm">
                        {paymentMessage}
                    </div>
                )}

                {snapToken && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pembayaran</CardTitle>
                            <CardDescription>
                                Selesaikan pembayaran melalui metode yang
                                tersedia.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {!snapReady && (
                                <p className="text-sm text-muted-foreground">
                                    Memuat halaman pembayaran...
                                </p>
                            )}

                            <div
                                id="snap-container"
                                className="min-h-[400px] w-full"
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
