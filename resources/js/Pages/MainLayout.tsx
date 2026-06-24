import NavbarLayout from "@/components/navbar";
import ComproFooter from "@/components/compro-footer";
import zeroSC from "@/asset/img/zeroSC-masihadabg.png";
import React from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#2e1044] text-[#1a0a2e]">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#8860b0_0,_#3c2060_35%,_#2e1044_70%,_#1a0a2e_100%)]" />
                <div className="absolute inset-0 opacity-12 [background-image:linear-gradient(#ffdd00_1px,transparent_1px),linear-gradient(90deg,#ffdd00_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={zeroSC}
                        alt="Growbit background illustration"
                        className="w-[920px] max-w-none opacity-45 blur-md"
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>
                <div className="absolute inset-0 bg-[#1a0a2e]/28 backdrop-blur-[1px]" />
                <div className="absolute left-[5%] top-28 h-24 w-24 bg-[#ff8800] opacity-70 [clip-path:polygon(0_25%,25%_25%,25%_0,75%_0,75%_25%,100%_25%,100%_75%,75%_75%,75%_100%,25%_100%,25%_75%,0_75%)]" />
                <div className="absolute right-[8%] top-40 h-16 w-16 bg-[#44ddff] opacity-70 [clip-path:polygon(0_25%,25%_25%,25%_0,75%_0,75%_25%,100%_25%,100%_75%,75%_75%,75%_100%,25%_100%,25%_75%,0_75%)]" />
                <div className="absolute bottom-16 left-[12%] h-20 w-20 bg-[#ff44aa] opacity-50 [clip-path:polygon(0_25%,25%_25%,25%_0,75%_0,75%_25%,100%_25%,100%_75%,75%_75%,75%_100%,25%_100%,25%_75%,0_75%)]" />
            </div>

            <NavbarLayout />
            <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                {children}
            </main>
            <ComproFooter />
        </div>
    );
}
