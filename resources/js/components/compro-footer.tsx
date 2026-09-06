import { Link } from "@inertiajs/react";

const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Feature", href: "/feature" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
];

export default function ComproFooter() {
    return (
        <footer className="mx-auto mt-12 w-full  px-4 pb-10 sm:px-6 lg:px-8">
            <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] p-5 shadow-[10px_10px_0px_0px_#1a0a2e] retro-enter">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 border-4 border-[#1a0a2e] bg-[#ffdd00] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#1a0a2e]">
                            Footer Station
                        </div>
                        <h2 className="mt-4 font-mono text-2xl font-black uppercase leading-tight text-[#1a0a2e] sm:text-3xl">
                            Growbit for modern UMKM with retro soul.
                        </h2>
                        <p className="mt-3 max-w-2xl font-mono text-sm leading-7 text-[#3c2060]">
                            Company profile, product management, inventory, dan
                            user access disatukan dalam identitas visual 8-bit
                            yang tegas dan mudah diingat.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {footerLinks.map((item, index) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="border-4 border-[#1a0a2e] bg-[#3c2060] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-[#ddc8f0] shadow-[6px_6px_0px_0px_#1a0a2e] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#1a0a2e] retro-pop"
                                style={{
                                    animationDelay: `${index * 90 + 120}ms`,
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t-4 border-[#1a0a2e] pt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#5a3888] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Growbit. All rights reserved.</p>
                    <p>Built for sales, stock, and storefront rhythm.</p>
                </div>
            </div>
        </footer>
    );
}
