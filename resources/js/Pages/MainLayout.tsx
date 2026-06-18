import NavbarLayout from "@/components/navbar";
import React from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-14">
            {/* Navbar ditaruh di sini sekali saja */}
            <NavbarLayout />

            {/* 'children' adalah tempat masuknya konten dari Home atau Feature */}
            <main className="mt-8">{children}</main>
        </div>
    );
}
