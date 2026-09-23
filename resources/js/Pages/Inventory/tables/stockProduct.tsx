import { InventoryProps } from "@/types";

interface ProductStockProps {
    filteredInventory: InventoryProps[];
    openEditModal: (inventory: InventoryProps) => void;
    handleSelectInventory: (productId: number) => void;
}

export default function ProductStock({
    filteredInventory,
    openEditModal,
    handleSelectInventory,
}: ProductStockProps) {
    return (
        <table className="w-full min-w-[1100px] table-fixed text-sm text-[#1a0a2e]">
            <thead className="sticky top-0 z-[1] border-b-4 border-[#1a0a2e] bg-[#44cc44] text-[#1a0a2e]">
                <tr>
                    <th className="border-r-4 border-[#1a0a2e] p-4 text-left">
                        Product Name
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] p-4 text-left">
                        Status
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] p-4 text-left">
                        Stock
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] p-4 text-left">
                        Minimum Stock
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] p-4 text-left">
                        Last Stock Out
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] p-4 text-left">
                        Last Stock In
                    </th>

                    <th
                        colSpan={2}
                        className="border-r-4 border-[#1a0a2e] p-4 text-left"
                    >
                        Last Update At
                    </th>

                    <th className="px-4 py-3 text-center">Action</th>
                </tr>
            </thead>

            <tbody>
                {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                        >
                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.product?.name}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.isActive === "YES"
                                    ? "Active"
                                    : "Inactive"}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.qty} {item.product?.unit?.code}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.minimum_stock}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.last_stock_out}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.last_stock_in}
                            </td>

                            <td
                                colSpan={2}
                                className="border-r-4 border-[#1a0a2e] px-4 py-3"
                            >
                                {item.updated_at &&
                                    new Date(item.updated_at).toLocaleString(
                                        "id-ID",
                                    )}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    {/* EDIT */}

                                    <button
                                        type="button"
                                        onClick={() => openEditModal(item)}
                                        className="cursor-pointer border-2 border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
                                    >
                                        EDIT
                                    </button>

                                    {/* VIEW MOVEMENT */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelectInventory(
                                                item.products_id,
                                            )
                                        }
                                        className="cursor-pointer border-2 border-[#1a0a2e] bg-[#44cc44] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#228822]"
                                    >
                                        VIEW
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={8}
                            className="px-4 py-8 text-center font-bold text-[#5a3888]"
                        >
                            NO PRODUCT STOCK FOUND.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
