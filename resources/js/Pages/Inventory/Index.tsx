import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { InventoryProps, Logs, PageProps, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Search, ShelvingUnit } from "lucide-react";
import { useState } from "react";
import Edit from "./form/Edit";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Inventory",
        href: "/inventory",
    },
];

interface Props extends PageProps {
    inventory: InventoryProps[];
    logs: Logs[];
}

export default function index({ inventory, logs, auth }: Props) {
    const [selectedLogsInventory, setLogsInventory] = useState<Logs[]>(logs);

    const [editingInventory, setEditingInventory] =
        useState<InventoryProps | null>(null);

    const handleSelectInventory = async (productId: number) => {
        try {
            const res = await fetch(`/inventory/view/${productId}`, {
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch inventory stock logs.");
            }

            const data = (await res.json()) as Logs[];

            setLogsInventory(data);
        } catch (error) {
            console.error(error);
        }
    };

    const openEditModal = (inventory: InventoryProps) => {
        setEditingInventory(inventory);
    };

    const closeEditModal = () => {
        setEditingInventory(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0]">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex items-center gap-2">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <ShelvingUnit size={28} />
                        <h2>Inventory Management</h2>
                    </div>

                    <div className="relative ">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffdd00]" />
                        <Input
                            placeholder="Search product . . ."
                            className="h-11 border-4 border-[#1a0a2e] bg-[#3c2060] pl-10 font-bold text-[#ddc8f0] placeholder:text-[#a88cc7] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    {/* <button
                        // onClick={() => handleRoute("create")}
                        className="border-4 border-[#1a0a2e] cursor-pointer bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                    >
                        + add Inventory
                    </button> */}
                </div>

                {/* Table */}
                <div className="overflow-x-auto border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e]">
                    <div className="bg-[#ff8800] border-b-4 border-[#1a0a2e] p-2">
                        <h3 className="font-bold text-[#1a0a2e] text-lg">
                            Inventory Stock Product
                        </h3>
                    </div>
                    <table className="w-full text-sm table-fixed text-[#1a0a2e]">
                        <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                            <tr>
                                {/* Ubah Header menyesuaikan data body */}
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Product Name
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Status
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Stock
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Minimum Stock
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Last Stock Out
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Last Stock In
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Last Update at
                                </th>
                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length > 0 ? (
                                inventory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                    >
                                        <td className="px-4 border-r-4 border-[#1a0a2e] py-3">
                                            {item.product?.name}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.isActive === "YES"
                                                ? "Active"
                                                : "Inactive"}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.qty}{" "}
                                            {item.product?.unit?.code}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.minimum_stock}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.last_stock_out}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.last_stock_in}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.updated_at &&
                                                new Date(
                                                    item.updated_at,
                                                ).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                className="border-2 cursor-pointer rounded-none border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
                                            >
                                                Edit
                                            </button>
                                            &nbsp;
                                            <button
                                                onClick={() =>
                                                    handleSelectInventory(
                                                        item.products_id,
                                                    )
                                                }
                                                className="border-2 cursor-pointer border-[#1a0a2e] bg-[#ff44aa] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#ff4444]"
                                            >
                                                View
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
                                        NO PRODUCT STOCK FOUND.
                                    </td>
                                </tr>
                            )}
                            <div className="px-4 py-3 border-[#1a0a2e] bg-[#ddc8f0] text-black flex justify-between">
                                <div>
                                    <p className="text-sm">
                                        {inventory.length} of {inventory.length}{" "}
                                        data
                                    </p>
                                </div>
                                <div></div>
                            </div>
                        </tbody>
                    </table>
                </div>

                <Edit
                    inventory={editingInventory}
                    isOpen={Boolean(editingInventory)}
                    onClose={closeEditModal}
                    userId={auth?.user?.id}
                />

                {/*  Inventory Movement  */}
                <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e]">
                    {/* Header */}
                    <div className="bg-[#ff8800] border-b-4 border-[#1a0a2e] p-2">
                        <h3 className="font-bold text-[#1a0a2e] text-lg">
                            Stock Movement Log
                        </h3>
                    </div>

                    <table className="w-full table-fixed text-sm text-[#1a0a2e]">
                        <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e]">
                            <tr>
                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    Product Name
                                </th>
                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    Actor
                                </th>

                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    Type
                                </th>

                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    Qty
                                </th>

                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    Before
                                </th>

                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    After
                                </th>

                                <th className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    Description
                                </th>

                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {selectedLogsInventory.length > 0 ? (
                                selectedLogsInventory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                    >
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.product?.name}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.user?.name}
                                        </td>
                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.module?.name}
                                        </td>
                                        <td className="px-4 py-3 text-right border-r-4 border-[#1a0a2e]">
                                            {item.new_value - item.old_value}
                                        </td>

                                        <td className="px-4 py-3 text-right border-r-4 border-[#1a0a2e]">
                                            {item.old_value}
                                        </td>

                                        <td className="px-4 py-3 text-right border-r-4 border-[#1a0a2e]">
                                            {item.new_value}
                                        </td>

                                        <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                            {item.description}
                                        </td>

                                        <td className="px-4 py-3">
                                            {item.created_at &&
                                                new Date(
                                                    item.created_at,
                                                ).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-[#5a3888] font-bold"
                                    >
                                        NO LOGS STOCK FOUND.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <div className="px-4 py-3 border-[#1a0a2e] bg-[#ddc8f0] text-black flex justify-between">
                            <div>
                                <p className="text-sm">
                                    {selectedLogsInventory.length} of{" "}
                                    {selectedLogsInventory.length} data
                                </p>
                            </div>
                            <div></div>
                        </div>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
