import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import {
    InventoryProps,
    Logs,
    PageProps,
    PaginationProps,
    type BreadcrumbItem,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import { LoaderCircle, Search, ShelvingUnit } from "lucide-react";
import { useEffect, useState } from "react";
import Edit from "./form/Edit";
import ProductStock from "./tables/stockProduct";
import MovementLogs from "./tables/movementLogs";
import PaginationWrapper from "@/components/pagination";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Inventory",
        href: "/inventory",
    },
];

interface Props extends PageProps {
    inventory: PaginationProps<InventoryProps>;
    logs: PaginationProps<Logs>;
}

type InventoryView = "stock" | "movement";

export default function index({ inventory, logs, auth }: Props) {
    const [activeView, setActiveView] = useState<InventoryView>("stock");

    const [selectedLogsInventory, setLogsInventory] = useState<Logs[]>(
        logs.data,
    );

    const [search, setSearch] = useState("");

    const [filteredInventory, setFilteredInventory] = useState<
        InventoryProps[]
    >(inventory.data);

    const [isSearching, setIsSearching] = useState(false);
    const [isSearchingLogs, setIsSearchingLogs] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [editingInventory, setEditingInventory] =
        useState<InventoryProps | null>(null);

    useEffect(() => {
        setIsSearching(true);

        const timer = window.setTimeout(() => {
            const normalizedSearch = search.trim().toLowerCase();

            setFilteredInventory(
                inventory.data.filter((item) =>
                    item.product?.name
                        ?.toLowerCase()
                        .includes(normalizedSearch),
                ),
            );

            setIsSearching(false);
            setIsInitialLoading(false);
        }, 400);

        return () => window.clearTimeout(timer);
    }, [inventory, search]);

    const handleSelectInventory = async (productId: number) => {
        setIsSearchingLogs(true);

        try {
            const res = await fetch(`/inventory/view/${productId}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch inventory stock logs.");
            }

            const payload = (await res.json()) as Logs[] | { data?: Logs[] };

            const data = Array.isArray(payload)
                ? payload
                : (payload?.data ?? []);

            setLogsInventory(data);

            // Pindahkan user langsung ke Movement Log
            setActiveView("movement");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearchingLogs(false);
        }
    };

    const openEditModal = (inventory: InventoryProps) => {
        setEditingInventory(inventory);
    };

    const closeEditModal = () => {
        setEditingInventory(null);
    };

    const resetInventoryFilter = () => {
        setSearch("");

        router.visit("/inventory", {
            replace: true,
            preserveScroll: true,
        });
    };

    const resetLogsFilter = async () => {
        setIsSearchingLogs(true);

        try {
            const res = await fetch("/inventory/logs", {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch all inventory logs.");
            }

            const payload = (await res.json()) as Logs[] | { data?: Logs[] };

            const data = Array.isArray(payload)
                ? payload
                : (payload?.data ?? []);

            setLogsInventory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearchingLogs(false);
        }
    };

    const handleViewChange = (view: InventoryView) => {
        setActiveView(view);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none bg-[#2e1044] p-6 text-[#ddc8f0]">
                <div className="flex shrink-0 items-center gap-2 border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e]">
                    <div className="flex items-center gap-2 text-xl font-bold text-[#ffdd00]">
                        <ShelvingUnit size={28} />

                        <h2>Inventory Management</h2>
                    </div>

                    {/* Search hanya digunakan pada Stock View */}
                    {activeView === "stock" && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffdd00]" />

                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search product . . ."
                                className="rounded-none border-4 border-[#1a0a2e] bg-[#3c2060] pl-10 font-bold text-[#ddc8f0] placeholder:text-[#a88cc7] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    )}
                </div>

                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e]">
                    {(isInitialLoading || isSearching || isSearchingLogs) && (
                        <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#ddc8f0]/80 pt-24 backdrop-blur-[1px]">
                            <div className="flex items-center gap-3 border-4 border-[#1a0a2e] bg-[#3c2060] px-5 py-4 text-[#ffdd00] shadow-[4px_4px_0px_0px_#1a0a2e]">
                                <LoaderCircle className="h-6 w-6 animate-spin" />

                                <span className="font-bold">
                                    {activeView === "stock"
                                        ? "SEARCHING INVENTORY . . ."
                                        : "LOADING INVENTORY LOGS . . ."}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex shrink-0 items-center justify-between border-b-4 border-[#1a0a2e] bg-[#ff8800] p-2">
                        <div className="ml-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => handleViewChange("stock")}
                                className={`
                                    cursor-pointer
                                    text-lg
                                    font-bold
                                    text-[#1a0a2e]
                                    transition-none
                                    ${
                                        activeView === "stock"
                                            ? "border-b-3 border-[#1a0a2e]"
                                            : "border-transparent"
                                    }
                                    border-b-3
                                    hover:border-[#1a0a2e]
                                `}
                            >
                                PRODUCT STOCK
                            </button>

                            <button
                                type="button"
                                onClick={() => handleViewChange("movement")}
                                className={`
                                    cursor-pointer
                                    text-lg
                                    font-bold
                                    text-[#1a0a2e]
                                    transition-none
                                    ${
                                        activeView === "movement"
                                            ? "border-b-3 border-[#1a0a2e]"
                                            : "border-transparent"
                                    }
                                    border-b-3
                                    hover:border-[#1a0a2e]
                                `}
                            >
                                MOVEMENT LOG
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={
                                activeView === "stock"
                                    ? resetInventoryFilter
                                    : resetLogsFilter
                            }
                            className="cursor-pointer border-2 border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[2px_2px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
                        >
                            RESET
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-auto">
                        {activeView === "stock" ? (
                            <ProductStock
                                filteredInventory={filteredInventory}
                                openEditModal={openEditModal}
                                handleSelectInventory={handleSelectInventory}
                            />
                        ) : (
                            <MovementLogs
                                selectedLogsInventory={selectedLogsInventory}
                            />
                        )}
                    </div>

                    <div className="flex shrink-0 items-center justify-between border-t-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 text-black">
                        {activeView === "stock" ? (
                            <>
                                <p className="text-sm">
                                    {inventory?.total
                                        ? `Showing ${inventory.data.length} of ${inventory.total} data`
                                        : "Showing 0 of 0 data"}
                                </p>

                                <div>
                                    <PaginationWrapper
                                        currentPage={inventory.current_page}
                                        totalPages={inventory.last_page}
                                        onPageChange={(page) =>
                                            router.get(
                                                "/inventory",
                                                {
                                                    page,
                                                    search: search || undefined,
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        getPageHref={(page) =>
                                            `/inventory?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`
                                        }
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm">
                                    {`${selectedLogsInventory.length} of ${selectedLogsInventory.length} data`}
                                </p>
                                <div>
                                    <PaginationWrapper
                                        currentPage={logs.current_page}
                                        totalPages={logs.last_page}
                                        onPageChange={(page) =>
                                            router.get(
                                                "/inventory",
                                                {
                                                    page,
                                                    search: search || undefined,
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        getPageHref={(page) =>
                                            `/inventory?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Edit
                    inventory={editingInventory}
                    isOpen={Boolean(editingInventory)}
                    onClose={closeEditModal}
                    userId={auth?.user?.id}
                />
            </div>
        </AppLayout>
    );
}
