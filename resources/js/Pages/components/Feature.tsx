import React from "react";
import MainLayout from "../MainLayout";
import {
    BadgeDollarSign,
    NotebookPen,
    BanknoteCheck,
    ReceiptText,
    PackageSearch,
    Warehouse,
} from "lucide-react";

const features = [
    {
        module: "Report",
        title: "Business Summary",
        icon: PackageSearch,
        description: "Pantau performa penjualan dan pergerakan bisnis dari panel ringkas yang mudah dipahami.",
        accent: "bg-[#ffdd00]",
    },
    {
        module: "Sales",
        title: "Point Of Sales",
        icon: BadgeDollarSign,
        description: "Bantu kasir atau owner mencatat transaksi lebih cepat dengan alur yang langsung ke inti.",
        accent: "bg-[#44ddff]",
    },
    {
        module: "Inventory",
        title: "Stock Control",
        icon: Warehouse,
        description: "Lihat stok aktif, unit produk, dan status inventory tanpa harus pindah alat kerja.",
        accent: "bg-[#44cc44]",
    },
    {
        module: "Finance",
        title: "Cash Flow",
        icon: BanknoteCheck,
        description: "Catat arus uang masuk dan keluar agar keputusan operasional lebih presisi.",
        accent: "bg-[#ff8800]",
    },
    {
        module: "Finance",
        title: "Transactions",
        icon: ReceiptText,
        description: "Riwayat transaksi disusun jelas untuk audit cepat dan kontrol aktivitas bisnis.",
        accent: "bg-[#ff44aa]",
    },
    {
        module: "Notes",
        title: "Notes / To Do",
        icon: NotebookPen,
        description: "Simpan catatan kecil dan tugas operasional harian dalam satu sistem yang sama.",
        accent: "bg-[#b898d8]",
    },
];

export default function Feature() {
    return (
        <section className="space-y-8">
            <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] p-6 shadow-[10px_10px_0px_0px_#1a0a2e] retro-enter">
                <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.32em] text-[#5a3888]">
                    Feature Deck
                </p>
                <h1 className="max-w-3xl font-mono text-4xl font-black uppercase leading-none text-[#1a0a2e] sm:text-5xl">
                    Modul inti untuk bisnis kecil yang ingin kerja lebih rapi.
                </h1>
                <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-[#3c2060]">
                    Semua fitur di halaman ini dirancang mengikuti gaya 8-bit yang sama dengan dashboard internal: tebal, kontras tinggi, dan langsung terbaca.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {features.map((item) => (
                    <article
                        key={item.title}
                        className="group border-4 border-[#1a0a2e] bg-[#3c2060] p-5 text-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#1a0a2e] retro-enter"
                        style={{
                            animationDelay: `${features.indexOf(item) * 90 + 100}ms`,
                        }}
                    >
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div className={`border-4 border-[#1a0a2e] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#1a0a2e] ${item.accent}`}>
                                {item.module}
                            </div>
                            <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] p-3 text-[#1a0a2e]">
                                <item.icon size={24} />
                            </div>
                        </div>

                        <h3 className="mb-3 font-mono text-2xl font-black uppercase leading-tight text-white">
                            {item.title}
                        </h3>

                        <p className="border-l-4 border-[#ffdd00] pl-4 font-mono text-sm leading-7 text-[#ddc8f0]">
                            {item.description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

Feature.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
