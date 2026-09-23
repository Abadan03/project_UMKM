import AppLayout from "@/layouts/app-layout";
import {
    PageProps,
    PaginationProps,
    ProductProps,
    UnitsProps,
    type BreadcrumbItem,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import { LoaderCircle, Package, Search } from "lucide-react";
import { confirmDialog } from "@/Pages/utils/popupModal";
import Create from "./form/Create";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import UnitModal from "./Units/Units";
import { Input } from "@headlessui/react";
import Edit from "./form/Edit";
import PaginationWrapper from "@/components/pagination";

interface Props extends PageProps {
    products: PaginationProps<ProductProps>;
    units: UnitsProps[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/products",
    },
];

export default function ProductsIndex({ products, units }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState(false);
    const searchRequestId = useRef(0);
    const [showUnits, setShowUnits] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(
        null,
    );
    const [showCreate, setShowCreate] = useState(false);

    const normalizedQuery = query.trim();
    const filteredProducts = useMemo(
        () => (normalizedQuery.length > 0 ? results : products.data),
        [normalizedQuery, products.data, results],
    );

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
        const keyword = search.trim();
        const requestId = searchRequestId.current + 1;
        searchRequestId.current = requestId;

        if (!keyword) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `/products/search?query=${encodeURIComponent(keyword)}`,
                { headers: { Accept: "application/json" } },
            );

            if (!res.ok) {
                throw new Error("Failed to fetch product search results.");
            }

            const payload = (await res.json()) as
                | ProductProps[]
                | { data?: ProductProps[] };

            const data = Array.isArray(payload)
                ? payload
                : (payload?.data ?? []);

            if (searchRequestId.current === requestId) {
                setResults(data);
            }
        } catch (error) {
            if (searchRequestId.current === requestId) {
                console.error(error);
                setResults([]);
            }
        } finally {
            if (searchRequestId.current === requestId) {
                setLoading(false);
            }
        }
    };

    const handleRoute = (mode: "create" | "edit" | "delete", id?: number) => {
        switch (mode) {
            case "create":
                setShowCreate(true);
                break;

            case "edit":
                const product = products?.data.find((item) => item.id === id);
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
        searchRequestId.current += 1;

        const delay = setTimeout(() => {
            if (query.length > 0) {
                fetchResults(query);
            } else {
                setResults([]);
                setLoading(false);
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
                    <div className="flex items-center gap-4 text-[#ffdd00] font-bold">
                        <div className="flex gap-2 text-xl">
                            <Package size={28} />
                            <h2>Products</h2>
                        </div>
                        <div className="relative ">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffdd00]" />
                            <Input
                                placeholder="Search product . . ."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="rounded-none border-4 border-[#1a0a2e] bg-[#3c2060] pl-10 font-bold text-[#ddc8f0] placeholder:text-[#a88cc7] focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                        Name
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Description
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Unit of Product
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        HPP
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Sell Price
                                    </th>
                                    <th className="px-4 py-4 text-center border-r-4 border-[#1a0a2e]">
                                        Last Update at
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
                                                {product.unit_name ?? "-"}
                                            </td>

                                            <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
                                                Rp{" "}
                                                {Number(
                                                    product.cost_price,
                                                ).toLocaleString("id-ID")}
                                            </td>

                                            <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
                                                Rp{" "}
                                                {Number(
                                                    product.sell_price,
                                                ).toLocaleString("id-ID")}
                                            </td>

                                            <td className="px-4 text-right py-3 border-r-4 border-[#1a0a2e]">
                                                {new Date(
                                                    product.updated_at,
                                                ).toLocaleString("id-ID")}
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
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-[#5a3888] font-bold"
                                        >
                                            NO PRODUCTS FOUND.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER (ALWAYS STICK TO BOTTOM) */}
                    <div className="flex shrink-0 items-center justify-between border-t-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 text-black">
                        <div>
                            <p className="text-sm">
                                {filteredProducts.length} of{" "}
                                {products.data.length} data
                            </p>
                        </div>
                        <div>
                            <PaginationWrapper
                                currentPage={products.current_page}
                                totalPages={products.last_page}
                                onPageChange={(page) =>
                                    router.get(
                                        `/products?page=${page}`,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                getPageHref={(page) => `/products?page=${page}`}
                            />
                        </div>
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
