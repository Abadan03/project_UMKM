import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { UnitsProps } from "@/types";

interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Create({ isOpen, onClose }: CreateProps) {
    const Units = usePage().props.units as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        qty: "",
        unit_id: "",
        pricing: "",
        description: "",
    });

    function handleSubmit(e: React.FormEvent) {
        console.log(data);
        e.preventDefault();
        post("/products/store", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success("Product created successfully.");
            },
            onError: () => {
                toast.error("Failed to create product. Please check the form.");
            },
        });
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center font-mono px-4 ${isOpen ? "flex" : "hidden"}`}
            style={{ background: "rgba(17, 21, 31, 0.85)" }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md"
                style={{
                    background: "#2a3142",
                    border: "4px solid #11151f",
                    boxShadow: "6px 6px 0 #11151f",
                }}
            >
                {/* Header */}
                <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                        background: "#5fa080",
                        borderBottom: "4px solid #11151f",
                    }}
                >
                    <div>
                        <h2 className="text-[#11151f] text-sm font-bold tracking-widest">
                            CREATE PRODUCT
                        </h2>
                        <p className="text-[#1c2230] text-[10px] tracking-wider mt-1">
                            &gt; FILL ALL FIELDS &lt;
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#11151f] text-sm font-bold w-7 h-7 flex items-center justify-center hover:bg-[#11151f] hover:text-[#5fa080] cursor-pointer"
                        style={{ border: "2px solid #11151f" }}
                    >
                        X
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 py-5 flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            NAME
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Product name"
                            className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        />
                        {errors.name && (
                            <span className="text-[#c0566a] text-[9px] tracking-wide">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Qty + Pricing */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                Stock
                            </label>
                            <input
                                type="number"
                                step={1}
                                value={data.qty}
                                min={0}
                                onChange={(e) => setData("qty", e.target.value)}
                                placeholder="Input Stock here"
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                            {errors.qty && (
                                <span className="text-[#c0566a] text-[9px] tracking-wide">
                                    {errors.qty}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5 ">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                Unit of Product
                            </label>
                            <select
                                className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                                value={data.unit_id}
                                onChange={(e) =>
                                    setData("unit_id", e.target.value)
                                }
                            >
                                {Units.map((unit: UnitsProps) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} - {unit.code}
                                    </option>
                                ))}
                            </select>
                            {errors.unit_id && (
                                <span className="text-[#c0566a] text-[9px] tracking-wide">
                                    {errors.unit_id}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                PRICING
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.pricing}
                                onChange={(e) =>
                                    setData("pricing", e.target.value)
                                }
                                placeholder="0.00"
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                            {errors.pricing && (
                                <span className="text-[#c0566a] text-[9px] tracking-wide">
                                    {errors.pricing}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            DESCRIPTION
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            placeholder="Product description"
                            rows={3}
                            className="font-mono text-[11px] text-[#1c2230] bg-white px-3 py-2 outline-none resize-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        />
                        {errors.description && (
                            <span className="text-[#c0566a] text-[9px] tracking-wide">
                                {errors.description}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-mono text-[10px] font-bold tracking-wider px-4 py-2.5 text-white active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                            style={{
                                background: "#c0566a",
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#a8455a")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "#c0566a")
                            }
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="font-mono text-[10px] font-bold tracking-wider px-4 py-2.5 text-[#11151f] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60 cursor-pointer"
                            style={{
                                background: "#5fa080",
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#4f8a6e")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "#5fa080")
                            }
                        >
                            {processing ? "SAVING..." : "SAVE"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
