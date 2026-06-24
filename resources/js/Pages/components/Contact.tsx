import React from "react";
import MainLayout from "../MainLayout";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactItems = [
    {
        icon: Mail,
        label: "Email",
        value: "support@growbit.local",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+62 812 3456 7890",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Jakarta, Indonesia",
    },
    {
        icon: Clock,
        label: "Hours",
        value: "Mon - Sat / 09.00 - 18.00",
    },
];

export default function Contact() {
    return (
        <section className="space-y-8">
            <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] p-6 shadow-[10px_10px_0px_0px_#1a0a2e] retro-enter">
                <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.32em] text-[#5a3888]">
                    Contact Terminal
                </p>
                <h1 className="max-w-3xl font-mono text-4xl font-black uppercase leading-none text-[#1a0a2e] sm:text-5xl">
                    Hubungi kami untuk demo atau implementasi.
                </h1>
                <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-[#3c2060]">
                    Halaman ini disiapkan sebagai pintu masuk calon pengguna yang ingin tanya fitur, pricing, atau kebutuhan custom untuk UMKM mereka.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-6 text-[#ddc8f0] shadow-[10px_10px_0px_0px_#1a0a2e] retro-enter-left" style={{ animationDelay: "120ms" }}>
                    <h2 className="font-mono text-2xl font-black uppercase text-white">
                        Send a Message
                    </h2>
                    <p className="mt-3 font-mono text-sm leading-7 text-[#ddc8f0]">
                        Form kontak bisa disambungkan nanti ke email, WhatsApp, atau ticketing. Sekarang tampilannya sudah disiapkan untuk tema vintage yang sama.
                    </p>

                    <div className="mt-6 space-y-4">
                        <input className="w-full border-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 font-mono text-sm text-[#1a0a2e] placeholder:text-[#5a3888]" placeholder="Nama" />
                        <input className="w-full border-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 font-mono text-sm text-[#1a0a2e] placeholder:text-[#5a3888]" placeholder="Email" />
                        <textarea className="min-h-40 w-full border-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 font-mono text-sm text-[#1a0a2e] placeholder:text-[#5a3888]" placeholder="Pesan" />
                        <button className="border-4 border-[#1a0a2e] bg-[#44cc44] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.28em] text-[#1a0a2e] shadow-[6px_6px_0px_0px_#1a0a2e]">
                            Kirim Pesan
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {contactItems.map((item) => (
                        <article
                            key={item.label}
                            className="flex items-center gap-4 border-4 border-[#1a0a2e] bg-[#ffdd00] p-4 shadow-[8px_8px_0px_0px_#1a0a2e] retro-enter-right"
                            style={{
                                animationDelay:
                                    `${contactItems.indexOf(item) * 90 + 150}ms`,
                            }}
                        >
                            <div className="border-4 border-[#1a0a2e] bg-[#1a0a2e] p-3 text-[#ffdd00]">
                                <item.icon size={20} />
                            </div>
                            <div className="font-mono">
                                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#5a3888]">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-sm font-black text-[#1a0a2e]">
                                    {item.value}
                                </p>
                            </div>
                        </article>
                    ))}

                    <div className="border-4 border-[#1a0a2e] bg-[#2e1044] p-6 text-[#ddc8f0] shadow-[10px_10px_0px_0px_#1a0a2e] retro-pop" style={{ animationDelay: "520ms" }}>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-[#ffdd00]">
                            Quick Note
                        </p>
                        <p className="mt-3 font-mono text-sm leading-7">
                            Versi ini masih statis, tapi fondasi visual dan struktur halamannya sudah lengkap untuk diteruskan ke form backend.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

Contact.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
