import React from "react";
import MainLayout from "../MainLayout";
import { Check, X, Crown, Shield } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "Rp 29K",
        accent: "bg-[#ffdd00]",
        summary: "Untuk toko kecil yang butuh company profile dan pencatatan dasar.",
        features: [
            ["Landing Page", true],
            ["Feature Page", true],
            ["Pricing Page", true],
            ["Contact Page", true],
            ["Dashboard Access", false],
            ["Role Management", false],
        ],
    },
    {
        name: "Retail",
        price: "Rp 59K",
        accent: "bg-[#44cc44]",
        summary: "Untuk operasional harian dengan products, inventory, dan user management.",
        features: [
            ["Landing Page", true],
            ["Feature Page", true],
            ["Pricing Page", true],
            ["Contact Page", true],
            ["Dashboard Access", true],
            ["Role Management", true],
        ],
    },
];

export default function Pricing() {
    return (
        <section className="space-y-8">
            <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] p-6 shadow-[10px_10px_0px_0px_#1a0a2e] retro-enter">
                <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.32em] text-[#5a3888]">
                    Pricing Board
                </p>
                <h1 className="max-w-3xl font-mono text-4xl font-black uppercase leading-none text-[#1a0a2e] sm:text-5xl">
                    Pilih paket yang paling pas untuk ritme bisnismu.
                </h1>
                <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-[#3c2060]">
                    Struktur harga dibuat sederhana. Fokusnya bukan gimmick, tapi paket yang cocok untuk UMKM yang ingin rapi sejak awal.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {plans.map((plan) => (
                    <article
                        key={plan.name}
                        className="flex flex-col border-4 border-[#1a0a2e] bg-[#3c2060] p-6 text-[#ddc8f0] shadow-[10px_10px_0px_0px_#1a0a2e] retro-pop"
                        style={{
                            animationDelay: `${plans.indexOf(plan) * 130 + 120}ms`,
                        }}
                    >
                        <div className={`mb-5 inline-flex w-fit items-center gap-2 border-4 border-[#1a0a2e] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#1a0a2e] ${plan.accent}`}>
                            {plan.name === "Retail" ? <Crown size={14} /> : <Shield size={14} />}
                            {plan.name}
                        </div>

                        <h2 className="font-mono text-3xl font-black uppercase text-white">
                            {plan.price}
                        </h2>
                        <p className="mt-3 font-mono text-sm leading-7 text-[#ddc8f0]">
                            {plan.summary}
                        </p>

                        <div className="mt-6 space-y-3">
                            {plan.features.map(([label, enabled]) => (
                                <div key={label} className="flex items-center justify-between border-4 border-[#1a0a2e] bg-[#2e1044] px-4 py-3 font-mono text-sm">
                                    <span>{label}</span>
                                    {enabled ? (
                                        <Check className="text-[#44cc44]" size={18} />
                                    ) : (
                                        <X className="text-[#ff4444]" size={18} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 border-4 border-[#1a0a2e] bg-[#ff8800] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.28em] text-[#1a0a2e] shadow-[6px_6px_0px_0px_#1a0a2e]">
                            Choose Plan
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}

Pricing.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
