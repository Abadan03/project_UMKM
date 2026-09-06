import zeroSC from "@/asset/img/zeroSC.png";
import { ArrowRight, Sparkles, ShieldCheck, Boxes } from "lucide-react";
import { Link } from "@inertiajs/react";
import MainLayout from "../MainLayout";

const highlights = [
    {
        title: "Pixel-Precise",
        description:
            "Antarmuka tebal, jelas, dan mudah dibaca di toko maupun kantor.",
        icon: Sparkles,
    },
    {
        title: "Retail Ready",
        description:
            "Cocok untuk stok, transaksi, dan operasional UMKM harian.",
        icon: Boxes,
    },
    {
        title: "Role Safe",
        description: "Akses dashboard dibatasi sesuai peran pengguna.",
        icon: ShieldCheck,
    },
];

export default function Section1() {
    return (
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 retro-enter">
                <div className="inline-flex items-center gap-2 border-4 border-[#1a0a2e] bg-[#ffdd00] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.28em] shadow-[6px_6px_0px_0px_#1a0a2e] retro-pop">
                    <span className="h-2 w-2 bg-[#1a0a2e]" />
                    Retro UMKM Toolkit
                </div>

                <div
                    className="space-y-4 border-4 border-[#1a0a2e] bg-[#ddc8f0] p-6 shadow-[10px_10px_0px_0px_#1a0a2e] retro-enter"
                    style={{ animationDelay: "90ms" }}
                >
                    <p className="font-mono text-sm font-bold uppercase tracking-[0.35em] text-[#5a3888]">
                        Growbit
                    </p>
                    <h1 className="max-w-xl font-mono text-4xl font-black uppercase leading-none text-[#1a0a2e] sm:text-6xl">
                        Sistem UMKM dengan rasa arcade lama
                    </h1>
                    <p className="max-w-xl font-mono text-sm leading-7 text-[#3c2060]">
                        Platform untuk mengelola produk, inventory, user, dan
                        tampilan company profile dalam satu paket visual 8-bit
                        yang kuat, tegas, dan berbeda.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 border-4 border-[#1a0a2e] bg-[#44cc44] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-[#1a0a2e] shadow-[6px_6px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#1a0a2e]"
                        >
                            Masuk Dashboard
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/feature"
                            className="inline-flex items-center gap-2 border-4 border-[#1a0a2e] bg-[#ff8800] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-[#1a0a2e] shadow-[6px_6px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#1a0a2e]"
                        >
                            Lihat Fitur
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    {highlights.map((item) => (
                        <article
                            key={item.title}
                            className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 text-[#ddc8f0] shadow-[6px_6px_0px_0px_#1a0a2e] retro-pop"
                            style={{
                                animationDelay: `${highlights.indexOf(item) * 120 + 140}ms`,
                            }}
                        >
                            <item.icon
                                className="mb-3 text-[#ffdd00]"
                                size={22}
                            />
                            <h3 className="mb-2 font-mono text-sm font-black uppercase tracking-[0.2em]">
                                {item.title}
                            </h3>
                            <p className="font-mono text-xs leading-6 text-[#b898d8]">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>

            <div className="relative retro-enter-right">
                <div className="absolute -left-4 top-6 h-24 w-24 border-4 border-[#1a0a2e] bg-[#ff44aa] shadow-[6px_6px_0px_0px_#1a0a2e]" />
                <div className="absolute right-0 top-0 h-20 w-20 border-4 border-[#1a0a2e] bg-[#44ddff] shadow-[6px_6px_0px_0px_#1a0a2e]" />
                <div className="relative border-4 border-[#1a0a2e] bg-[#ddc8f0] p-4 shadow-[12px_12px_0px_0px_#1a0a2e]">
                    <div className="border-4 border-[#1a0a2e] bg-[#2e1044] p-3">
                        <img
                            src={zeroSC}
                            alt="Growbit dashboard preview"
                            className="h-auto w-full object-contain"
                            style={{ imageRendering: "pixelated" }}
                        />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="border-4 border-[#1a0a2e] bg-[#ffdd00] p-3 font-mono text-xs font-bold uppercase tracking-[0.22em]">
                            Inventory
                        </div>
                        <div className="border-4 border-[#1a0a2e] bg-[#44cc44] p-3 font-mono text-xs font-bold uppercase tracking-[0.22em]">
                            Sales Tools
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

Section1.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
