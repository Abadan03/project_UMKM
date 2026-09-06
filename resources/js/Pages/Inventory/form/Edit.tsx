import { InventoryProps } from "@/types";
import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface EditProps {
    inventory: InventoryProps | null;
    isOpen: boolean;
    onClose: () => void;
    userId?: number | null;
}

export default function Edit({
    inventory,
    isOpen,
    onClose,
    userId,
}: EditProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        qty: 0,
        minimum_stock: 0,
        isActive: "YES",
        user_id: null as number | null,
    });

    const closeModal = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inventory) {
            return;
        }

        put(`/inventory/update/${inventory.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast.success("Inventory updated successfully.");
            },
        });
    };

    useEffect(() => {
        if (!inventory) {
            return;
        }

        setData({
            qty: inventory.qty ?? 0,
            minimum_stock: inventory.minimum_stock ?? 0,
            isActive: inventory.isActive ?? "YES",
            user_id: userId ?? null,
        });
    }, [inventory, userId]);

    if (!isOpen || !inventory) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0a2e]/80 px-4">
            <div className="w-full max-w-md border-4 border-[#1a0a2e] bg-[#3c2060] shadow-[8px_8px_0px_0px_#1a0a2e]">
                <div className="flex items-center justify-between border-b-4 border-[#1a0a2e] bg-[#ff8800] px-4 py-3 text-[#1a0a2e]">
                    <div>
                        <h3 className="font-bold">EDIT INVENTORY</h3>
                        <p className="text-xs font-bold">
                            {inventory.product?.name}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="border-2 cursor-pointer border-[#1a0a2e] px-2 py-1 font-bold shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e]"
                    >
                        X
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-[#ffdd00]">
                                Stock
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={data.qty}
                                onChange={(e) =>
                                    setData("qty", Number(e.target.value))
                                }
                                className="border-4 border-[#1a0a2e] bg-[#ddc8f0] px-3 py-2 text-[#1a0a2e] outline-none"
                            />
                            {errors.qty && (
                                <span className="text-xs text-[#ff88aa]">
                                    {errors.qty}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-[#ffdd00]">
                                Minimum Stock
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={data.minimum_stock}
                                onChange={(e) =>
                                    setData(
                                        "minimum_stock",
                                        Number(e.target.value),
                                    )
                                }
                                className="border-4 border-[#1a0a2e] bg-[#ddc8f0] px-3 py-2 text-[#1a0a2e] outline-none "
                            />
                            {errors.minimum_stock && (
                                <span className="text-xs text-[#ff88aa]">
                                    {errors.minimum_stock}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-[#ffdd00]">
                            Status
                        </label>
                        <select
                            value={data.isActive}
                            onChange={(e) =>
                                setData("isActive", e.target.value)
                            }
                            className="border-4 border-[#1a0a2e] bg-[#ddc8f0] px-3 py-2 text-[#1a0a2e] outline-none"
                        >
                            <option value="YES">Active</option>
                            <option value="NO">Inactive</option>
                        </select>
                        {errors.isActive && (
                            <span className="text-xs text-[#ff88aa]">
                                {errors.isActive}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="border-4 cursor-pointer border-[#1a0a2e] bg-[#ff44aa] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="border-4 cursor-pointer border-[#1a0a2e] bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] disabled:opacity-60"
                        >
                            {processing ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
