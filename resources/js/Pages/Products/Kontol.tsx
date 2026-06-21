import PageHeader from "@/components/page-header";
// Tombol asli dari UI diganti dengan tag button standar agar styling 8-bit tidak bentrok dengan default variant UI kamu
import AppLayout from "@/layouts/app-layout";
import { PageProps, type BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Package } from "lucide-react";
import Swal from "sweetalert2";
import { confirmDialog } from "@/Pages/utils/popupModal";
import Create from "./formeet/Create";
import { useState } from "react";
import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/pixelact-ui/button";

interface Product {
    id: number;
    name: string;
    qty: number;
    pricing: number;
    description: string;
    created_at: string;
}

interface Props extends PageProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/products",
    },
];

export default function ProductsIndex({ products }: Props) {
    const [showCreate, setShowCreate] = useState(false);

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDialog({
            title: "Delete product?",
            text: "Product will be permanently removed.",
            confirmText: "Delete",
            icon: "warning",
        });

        if (!confirmed) return;

        router.delete(`/products/delete/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Product has been deleted.");
            },
            onError: () => {
                toast.error("Failed to delete product.");
            },
        });
    };

    const handleRoute = (mode: "create" | "edit" | "delete", id?: number) => {
        switch (mode) {
            case "create":
                setShowCreate(true);
                break;

            case "edit":
                router.get(`/products/edit/${id}`);
                break;

            case "delete":
                handleDelete(id!);
                break;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Wrapper utama dengan tema dark purple dan font monospaced */}
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0] min-h-screen">
                {/* Modifikasi PageHeader agar cocok dengan tema, menambahkan aksen warna kuning dan hijau */}
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <Package size={28} />
                        <h2>Products</h2>
                    </div>

                    <button
                        onClick={() => handleRoute("create")}
                        className="border-4 cursor-pointer border-[#1a0a2e] bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                    >
                        + Add Product
                    </button>
                </div>

                {/* Table Container dengan style 8-bit soft */}
                <div className="overflow-x-auto border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e]">
                    <table className="w-full text-sm text-[#1a0a2e]">
                        <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                            <tr>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Name
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Quantity
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Pricing
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Description
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Created at
                                </th>
                                <th className="px-4 py-4 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                    >
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e] font-bold">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {product.qty}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            Rp{" "}
                                            {product.pricing.toLocaleString(
                                                "id-ID",
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {product.description}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {new Date(
                                                product.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleRoute(
                                                        "edit",
                                                        product.id,
                                                    )
                                                }
                                                className="border-2 cursor-pointer rounded-none border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
                                            >
                                                EDIT
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleRoute(
                                                        "delete",
                                                        product.id,
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
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-[#5a3888] font-bold bg-[#ddc8f0]"
                                    >
                                        NO PRODUCTS FOUND.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Create isOpen={showCreate} onClose={() => setShowCreate(false)} />
        </AppLayout>
    );
}
