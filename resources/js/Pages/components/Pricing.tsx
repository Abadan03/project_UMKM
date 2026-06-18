import React from "react";
import MainLayout from "../MainLayout";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingFeatures = [
    {
        module: "Report",
        feature: "Business Summary",
        starter: true,
        professional: true,
        enterprise: true,
    },
    {
        module: "Sales",
        feature: "Point of Sales",
        starter: true,
        professional: true,
        enterprise: true,
    },
    {
        module: "Inventory",
        feature: "Managing Stock of Goods",
        starter: false,
        professional: true,
        enterprise: true,
    },
    {
        module: "Finance",
        feature: "Cash Flow",
        starter: false,
        professional: true,
        enterprise: true,
    },
    {
        module: "Finance",
        feature: "Transaction",
        starter: true,
        professional: true,
        enterprise: true,
    },
    {
        module: "Notes",
        feature: "Notes / To Do",
        starter: true,
        professional: true,
        enterprise: true,
    },
];

export default function Pricing() {
    return (
        <>
            <section className="min-h-screen w-full flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl font-bold leading-tight text-center text-slate-900">
                    Pricing Plans
                    <br />
                    Choose the plan that's right for you
                </h1>
                <div className="overflow-hidden w-3/4 border-4 border-[#283618] bg-[#FEFAE0] shadow-[8px_8px_0_0_#283618]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#606C38] text-white">
                                <th className="border border-[#283618] p-4 text-center">
                                    Modul
                                </th>

                                <th className="border border-[#283618] p-4 text-center">
                                    Feature
                                </th>

                                <th className="border border-[#283618] p-4 text-center">
                                    Basic
                                </th>

                                <th className="border border-[#283618] bg-[#BC6C25] p-4 text-center">
                                    Profesional
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pricingFeatures.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-[#DDA15E]/10 transition-colors"
                                >
                                    <td className="border border-[#283618] p-4 font-semibold">
                                        {item.module}
                                    </td>

                                    <td className="border border-[#283618] p-4">
                                        {item.feature}
                                    </td>

                                    <td className="border border-[#283618] p-4 text-center">
                                        {item.starter ? (
                                            <Check
                                                className="mx-auto"
                                                size={20}
                                            />
                                        ) : (
                                            <X className="mx-auto" size={20} />
                                        )}
                                    </td>

                                    <td className="border border-[#283618] bg-[#DDA15E]/20 p-4 text-center">
                                        {item.professional ? (
                                            <Check
                                                className="mx-auto"
                                                size={20}
                                            />
                                        ) : (
                                            <X className="mx-auto" size={20} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="text-xl font-bold leading-tight text-center text-slate-900">
                        Need Customize Features ?
                    </h2>
                    <Button
                        className="bg-[#3c2060] text-[#ffdd00] font-bold hover:bg-blue-900"
                        size={"lg"}
                    >
                        Whisper Us !
                    </Button>
                </div>
            </section>
        </>
    );
}

Pricing.layout = (page: React.ReactNode) => <MainLayout children={page} />;
