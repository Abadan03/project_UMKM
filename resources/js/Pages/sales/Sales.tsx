import { DatePickerWithRange } from "@/components/datepicker";
import { BadgePercent, LoaderCircle, Receipt } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { format } from "date-fns";
import { PageProps, SaleProps, type BreadcrumbItem } from "@/types";
import { Input } from "@headlessui/react";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { confirmDialog } from "../utils/popupModal";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Sales",
        href: "/Sales",
    },
];

interface Props extends PageProps {
    sales: SaleProps[];
}

export default function SalesIndex({ sales }: Props) {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [showCreate, setShowCreate] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [paramsQuery, setparamsQuery] = useState("");
    const [query, setQuery] = useState("");

    console.log("paramsQuery:", paramsQuery);
    console.log("query:", query);
    console.log("dateRange:", dateRange);

    const statsData = [
        {
            title: "Total Revenue Today",
            value: "Rp 45.2M",
            icon: BadgePercent,
            color: "bg-[#B6CBBD]",
        }, // Kuning
        {
            title: "Transactions Today",
            value: "+1,204",
            icon: BadgePercent,
            color: "bg-[#CBA35C]",
        }, // Cyan
        {
            title: "Total Revenue Monthly",
            value: "Rp 45.2M",
            icon: BadgePercent,
            color: "bg-[#B6CBBD]",
        }, // Kuning
        {
            title: "Transactions Monthly",
            value: "+1,204",
            icon: BadgePercent,
            color: "bg-[#CBA35C]",
        }, // Cyan
    ];

    // tranform date range
    const getSearchParams = () => {
        if (!paramsQuery) return null;

        if (paramsQuery === "date") {
            if (!dateRange?.from) return null;

            return {
                mode: "search",
                search_by: "date",
                date_from: format(dateRange.from, "dd-MM-yyyy"),
                date_to: format(dateRange.to ?? dateRange.from, "dd-MM-yyyy"),
            };
        }

        if (!query.trim()) return null;

        return {
            mode: "search",
            search_by: paramsQuery,
            query: query.trim(),
        };
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDialog({
            title: "Delete Transactions?",
            text: "Transactions will be permanently removed.",
            confirmText: "Delete",
            icon: "warning",
        });

        if (!confirmed) return;

        router.delete(`/transactions/destroy/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Product has been deleted.");
            },
            onError: () => {
                toast.error("Failed to delete product.");
            },
        });
    };

    const handleRoute = (
        mode: "create" | "edit" | "search" | "delete",
        id?: number,
    ) => {
        switch (mode) {
            case "create":
                setShowCreate(true);
                break;

            case "edit":
                setIsEditOpen(true);
                break;

            case "search":
                const searchParams = getSearchParams();

                if (!searchParams?.search_by) {
                    toast.error("Please provide search criteria.");
                    return;
                }

                setIsSearching(true);

                router.get("/sales/search", searchParams, {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsSearching(false),
                });

                break;

            case "delete":
                handleDelete(id!);
                break;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />

            {/* Wrapper utama dengan tema dark purple dan font monospaced */}
            <div className="font-mono uppercase flex w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0] ">
                {/* Modifikasi PageHeader agar cocok dengan tema, menambahkan aksen warna kuning dan hijau */}
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-4 text-[#ffdd00] font-bold text-xl">
                        <div className="flex gap-2">
                            <Receipt size={28} />
                            <h2>Sales</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="filter" className="p-0">
                                Search By:
                            </label>
                            <select
                                name="filter"
                                id="filter"
                                onChange={(e) => {
                                    setparamsQuery(e.target.value);
                                    setQuery("");
                                }}
                                className="rounded-none cursor-pointer text-sm border-2 border-[#1a0a2e] bg-[#ddc8f0] px-2 py-1 text-[#1a0a2e] font-bold shadow-[3px_3px_0px_0px_#1a0a2e]"
                            >
                                <option value="invoice">invoice</option>
                                <option value="date">date</option>
                                <option value="cashier">cashier</option>
                                <option value="payment">payment</option>
                            </select>
                            {paramsQuery && (
                                <>
                                    {paramsQuery === "date" ? (
                                        <DatePickerWithRange
                                            value={dateRange}
                                            onChange={setDateRange}
                                        />
                                    ) : (
                                        <Input
                                            type="text"
                                            placeholder={`Search ${paramsQuery}...`}
                                            value={query}
                                            onChange={(e) => {
                                                setQuery(e.target.value);
                                            }}
                                            className="ml-2 rounded-none text-sm border-2 border-[#1a0a2e] bg-[#ddc8f0] px-2 py-1 text-[#1a0a2e] font-bold shadow-[3px_3px_0px_0px_#1a0a2e]"
                                        />
                                    )}
                                    <button
                                        onClick={() => handleRoute("search")}
                                        disabled={isSearching}
                                        className="cursor-pointer rounded-none text-lg border-2 border-[#1a0a2e] bg-[#3c2060] px-2 py-1 text-[#ffdd00] font-bold shadow-[3px_3px_0px_0px_#1a0a2e] hover:bg-[#ffdd00] hover:text-[#1a0a2e]"
                                    >
                                        Search
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sales Overview */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className={`border-2 border-[#1a0a2e] ${stat.color} p-4 shadow-[6px_6px_0px_0px_#1a0a2e] hover:-translate-y-1 hover:shadow-[6px_10px_0px_0px_#1a0a2e] transition-all`}
                        >
                            <h3 className="font-bold text-[#1a0a2e] text-lg">
                                {stat.title}
                            </h3>
                            <p className="text-3xl text-end text-[#1a0a2e] font-black">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table Container dengan style 8-bit soft */}
                <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e] flex flex-col h-full">
                    {/* TABLE SECTION */}
                    <div className="relative min-h-[360px] overflow-x-auto flex-1">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#ddc8f0]/80 pt-24 backdrop-blur-[1px]">
                                <div className="flex items-center gap-3 border-4 border-[#1a0a2e] bg-[#3c2060] px-5 py-4 text-[#ffdd00] shadow-[4px_4px_0px_0px_#1a0a2e]">
                                    <LoaderCircle className="h-6 w-6 animate-spin" />
                                    <span className="font-bold">
                                        SEARCHING PRODUCTS...
                                    </span>
                                </div>
                            </div>
                        )}
                        <table className="w-full table-fixed text-sm text-[#1a0a2e]">
                            <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                                <tr>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Invoice
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Date
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Cashier
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Payment Method
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Total
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Status
                                    </th>
                                    <th className="px-4 py-4 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {sales.length > 0 ? (
                                    sales.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                        >
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {sale.invoice_id}
                                            </td>

                                            <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
                                                {new Date(
                                                    sale.transaction_date,
                                                ).toLocaleString("id-ID")}
                                            </td>

                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {/* {sale.cashier_name ?? "-"} */}
                                            </td>

                                            <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                                {sale.payment_method}
                                            </td>

                                            <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
                                                Rp{" "}
                                                {Number(
                                                    sale.total,
                                                ).toLocaleString("id-ID")}
                                            </td>

                                            <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                                {sale.status}
                                            </td>

                                            <td className="px-4 py-3 text-center flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleRoute(
                                                            "edit",
                                                            sale.id,
                                                        )
                                                    }
                                                    className="border-2 cursor-pointer border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
                                                >
                                                    EDIT
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleRoute(
                                                            "delete",
                                                            sale.id,
                                                        )
                                                    }
                                                    className="border-2 cursor-pointer border-[#1a0a2e] bg-[#ff44aa] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#ff4444]"
                                                >
                                                    DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-[#5a3888] font-bold"
                                        >
                                            NO SALES FOUND.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER (ALWAYS STICK TO BOTTOM) */}
                    <div className="px-4 py-3 border-t-2 border-[#1a0a2e] bg-[#ddc8f0] text-black flex justify-between">
                        <div>
                            <p className="text-sm">
                                {/* {filteredProducts.length} of {products.length}{" "} */}
                                data
                            </p>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
