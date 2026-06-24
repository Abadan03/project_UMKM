import PageHeader from "@/components/page-header";
import AppLayout from "@/layouts/app-layout";
import {
    PageProps,
    ProductProps,
    UnitsProps,
    type BreadcrumbItem,
} from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Package, Search, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { confirmDialog } from "@/Pages/utils/popupModal";
import Create from "./form/Create";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UnitModal from "./Units/Units";
import { Input } from "@headlessui/react";
import Edit from "./form/Edit";
import CreateUnitModal from "./Units/CreateUnit";

interface Product {
    id: number;
    name: string;
    qty: number;
    unit: string;
    pricing: number;
    description: string;
    created_at?: string;
}

interface Props extends PageProps {
    products: ProductProps[];
    units: UnitsProps[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/products",
    },
];

export default function ProductsIndex({ products, units }: Props) {
    const controller = new AbortController();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUnits, setShowUnits] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(
        null,
    );
    const [showCreate, setShowCreate] = useState(false);

    const filteredProducts = query.trim().length > 0 ? results : products;

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDialog({
            title: "Delete product?",
            text: "Product will be permanently removed.",
            confirmText: "Delete",
            icon: "warning",
        });

        if (!confirmed) return;

        router.delete(`/products/destroy/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Product has been deleted.");
            },
            onError: () => {
                toast.error("Failed to delete product.");
            },
        });
    };

    const fetchResults = async (search: string) => {
        setLoading(true);

        try {
            const res = await fetch(`/products/search?query=${search}`, {
                signal: controller.signal,
            });
            const data = await res.json();

            setResults(data);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoute = (mode: "create" | "edit" | "delete", id?: number) => {
        switch (mode) {
            case "create":
                setShowCreate(true);
                break;

            case "edit":
                const product = products.find((item) => item.id === id);
                if (!product) {
                    toast.error("Failed to find data product.");
                    return;
                }

                setSelectedProduct(product);
                setIsEditOpen(true);
                break;

            case "delete":
                handleDelete(id!);
                break;
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.length > 0) {
                fetchResults(query);
            } else {
                setResults([]);
            }
        }, 500); // 300–500ms ideal

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Wrapper utama dengan tema dark purple dan font monospaced */}
            <div className="font-mono uppercase flex w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0] ">
                {/* Modifikasi PageHeader agar cocok dengan tema, menambahkan aksen warna kuning dan hijau */}
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-4 text-[#ffdd00] font-bold text-xl">
                        <div className="flex ">
                            <Package size={28} />
                            <h2>Products</h2>
                        </div>
                        <div className="relative ">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffdd00]" />
                            <Input
                                placeholder="Search product . . ."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-11 border-4 border-[#1a0a2e] bg-[#3c2060] pl-10 font-bold text-[#ddc8f0] placeholder:text-[#a88cc7] rounded-none shadow-[2px_2px_0px_0px_#1a0a2e] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowUnits(true)}
                            className="border-4 cursor-pointer border-[#1a0a2e] bg-[#44ddff] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                        >
                            View Units
                        </button>

                        <button
                            onClick={() => handleRoute("create")}
                            className="border-4 cursor-pointer border-[#1a0a2e] bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                        >
                            + Product
                        </button>
                    </div>
                </div>

                {/* Table Container dengan style 8-bit soft */}
                <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e] flex flex-col h-full">
                    {/* TABLE SECTION */}
                    <div className="overflow-x-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="relative">
                                    <div className="relative w-32 h-32">
                                        <div
                                            className="absolute w-32 h-32 rounded-full border-[4px] border-[#2D3748]/30 border-r-[#ff8800] border-b-[#ff8800] animate-spin"
                                            style={{
                                                animationDuration: "2.8s",
                                            }}
                                        ></div>

                                        <div
                                            className="absolute w-32 h-32 rounded-full border-[4px] border-[#2D3748]/30 border-t-[#68D391] animate-spin"
                                            style={{
                                                animationDuration: "2s",
                                                animationDirection: "reverse",
                                            }}
                                        ></div>
                                    </div>
                                    <div className="absolute inset-0 bg-[#68D391]/10 animate-pulse rounded-full blur-md" />
                                </div>
                            </div>
                        ) : (
                            <table className="w-full table-fixed text-sm text-[#1a0a2e]">
                                <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                                    <tr>
                                        <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                            Name
                                        </th>
                                        <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                            Description
                                        </th>
                                        <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                            Unit of Product
                                        </th>
                                        <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                            Pricing
                                        </th>
                                        <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                            Created at
                                        </th>
                                        <th className="px-4 py-4 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                            >
                                                <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                    {product.name}
                                                </td>

                                                <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                    {product.description}
                                                </td>

                                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                                    {product.unit_name}
                                                </td>

                                                <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
                                                    Rp{" "}
                                                    {product.pricing.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </td>

                                                <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
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
                                                        className="border-2 cursor-pointer border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
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
                                                className="px-4 py-8 text-center text-[#5a3888] font-bold"
                                            >
                                                NO PRODUCTS FOUND.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* FOOTER (ALWAYS STICK TO BOTTOM) */}
                    <div className="px-4 py-3 border-t-2 border-[#1a0a2e] bg-[#ddc8f0] text-black flex justify-between">
                        <div>
                            <p className="text-sm">
                                {products.length} of {products.length} data
                            </p>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>

            <UnitModal isOpen={showUnits} onClose={() => setShowUnits(false)} />
            <Create isOpen={showCreate} onClose={() => setShowCreate(false)} />
            <Edit
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                product={selectedProduct}
            />
        </AppLayout>
    );
}
