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
        Module: "Report",
        Title: "Business Summary ",
        icon: PackageSearch,
        Description: "Description feature 2",
    },
    {
        Module: "Sales",
        Title: "Point of Sales",
        icon: BadgeDollarSign,
        Description: "Description feature 1",
    },
    {
        Module: "Inventory",
        Title: "Stock of goods",
        icon: Warehouse,
        Description: "Description feature 3",
    },
    {
        Module: "Finance",
        Title: "Cash Flow",
        icon: BanknoteCheck,
        Description: "Description feature 4",
    },
    {
        Module: "Finance",
        Title: "Transaction",
        icon: ReceiptText,
        Description: "Description feature 5",
    },
    {
        Module: "Notes",
        Title: "Notes / To Do",
        icon: NotebookPen,
        Description: "Description feature 6",
    },
];

export default function Feature() {
    return (
        <>
            <section className="min-h-screen flex flex-col items-center justify-center">
                {/* <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                    Fitur Kami
                    <br />
                    Beberapa Fitur unggulan dan kekurangan
                </h1> */}
                <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                    Features
                </h1>
                <div className="mt-2 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                        Over one million Businessmen have given a 5-star review
                        to their salesgear.
                    </p>
                </div>

                <div className="mt-12 w-2/3 grid gap-12 lg:grid-cols-3 lg:items-center">
                    {/* Card Content */}
                    {features.map((item) => (
                        <article className="flex flex-col items-start justify-between border-4 border-[#283618] bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 shadow-[8px_8px_0_0_#283618] transition-transform duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white shadow-[8px_8px_0_0_#283618] transition-shadow duration-500 ease-in-out hover:shadow-[12px_12px_0_0_#283618]">
                            <div className="mb-4 flex items-center gap-x-2 text-xs">
                                <p className="relative z-10 border-2 border-gray-900 bg-[#606C38] px-3 py-1 font-bold text-white">
                                    {item.Module}
                                </p>
                            </div>
                            <div className="group relative w-full flex flex-col items-center text-center gap-4">
                                <h3 className="text-2xl font-black uppercase text-black">
                                    {item.Title}
                                </h3>

                                <div className="flex justify-center">
                                    <item.icon
                                        size={40}
                                        className="text-[#606C38]"
                                    />
                                </div>

                                <p className="w-full border-l-4 border-[#BC6C25] pl-4 text-left text-gray-800">
                                    {item.Description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}

Feature.layout = (page: React.ReactNode) => <MainLayout children={page} />;
