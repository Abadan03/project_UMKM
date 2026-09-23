import AppLayout from "@/layouts/app-layout";
import {
    PageProps,
    type BreadcrumbItem,
    InventoryProps,
    SalesProps,
    PaginationProps,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import { NotebookTabsIcon } from "lucide-react";
import { useState } from "react";
import View from "../sales/form/Preview";
import SalesNotes from "./tables/SalesNotes";
import ProductStock from "./tables/ProductStock";

interface Props extends PageProps {
    sales: PaginationProps<SalesProps>;
    product: PaginationProps<InventoryProps>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Notes",
        href: "/notes",
    },
];

export default function NotesIndex({ sales, product }: Props) {
    const [loading, setLoading] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState<SalesProps | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleRoute = (
        mode: "preview" | "search",
        table: "sales" | "inventory", // sesuaikan dengan routes group pada web
        id?: number,
    ) => {
        switch (mode) {
            case "preview":
                if (id === undefined) {
                    return;
                }

                if (table === "inventory") {
                    router.visit(`/inventory?product_id=${id}`);
                    return;
                }

                const selectedSale = sales.data.find((sale) => sale.id === id);
                if (!selectedSale) return;

                setSelectedNotes(selectedSale);
                setShowPreview(true);
                break;
        }
    };

    //
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notes" />
            <div className="font-mono uppercase flex h-full min-h-0 w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0]">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <NotebookTabsIcon size={28} />
                        <h2>Notes</h2>
                    </div>
                </div>

                {/* Table Container dengan style 8-bit soft */}
                <div className="flex min-h-0 flex-1 gap-2">
                    {/* TABLE SECTION */}
                    <div className="flex bg-[#ddc8f0]  h-full min-h-0 min-w-0 flex-1 flex-col shadow-[8px_8px_0px_0px_#1a0a2e]">
                        {/* Table Sales Notes */}
                        <SalesNotes
                            loading={loading}
                            sales={sales}
                            handleRoute={handleRoute}
                        />
                        {/* FOOTER */}
                        <div className="flex shrink-0 justify-between border-t-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 text-black">
                            <div>
                                <p className="text-sm">
                                    {sales.data.length} of {sales.total} data
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-[#ddc8f0]  h-full min-h-0 min-w-0 flex-1 flex-col shadow-[8px_8px_0px_0px_#1a0a2e]">
                        {/* Table Product Stock Notes */}
                        <ProductStock
                            loading={loading}
                            product={product}
                            handleRoute={handleRoute}
                        />
                        {/* FOOTER */}
                        <div className="flex shrink-0 justify-between border-t-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 text-black">
                            <div>
                                <p className="text-sm">
                                    {product.data.length} of {product.total}{" "}
                                    data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <View
                isOpen={showPreview}
                onClose={() => {
                    setShowPreview(false);
                    setSelectedNotes(null);
                }}
                sales={selectedNotes}
            />
        </AppLayout>
    );
}
