import { UnitsProps } from "@/types";

import CheckboxCP from "@/components/checkboxCP";
import { useState } from "react";
import Notes from "@/components/notes";

interface CategoriesFarmProps {
    data: any;
    setData: any;
    processing: boolean;
    errors: any;
    // units: UnitsProps[];
    onClose: () => void;
    reset: () => void;
    showPriceEditToggle?: boolean;
}

export default function CategoriesForm({
    data,
    processing,
    setData,
    errors,
    reset,
    // units,
    onClose,
    showPriceEditToggle = false,
}: CategoriesFarmProps) {
    const [isCP, setIsCP] = useState(false);
    const canEditPrice = !showPriceEditToggle || isCP;
    const priceInputClassName = `font-mono text-xs px-3 py-2 outline-none placeholder:text-[#9aa3b5] ${
        canEditPrice
            ? "bg-white text-[#1c2230] focus:bg-[#eef1f6]"
            : "bg-[#e5e7eb] text-[#7b8496] cursor-not-allowed"
    }`;

    return (
        <div className="px-4 py-5 flex flex-col gap-4">
            <Notes />
            {/* Name */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                    NAME
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Categories name"
                    className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                    style={{
                        border: "3px solid #11151f",
                        boxShadow: "3px 3px 0 #11151f",
                    }}
                    name="name"
                />
                {errors.name && (
                    <span className="text-[#c0566a] text-[9px] tracking-wide">
                        {errors.name}
                    </span>
                )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                    DESCRIPTION
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Categories description"
                    rows={3}
                    className="font-mono text-[11px] text-[#1c2230] bg-white px-3 py-2 outline-none resize-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                    style={{
                        border: "3px solid #11151f",
                        boxShadow: "3px 3px 0 #11151f",
                    }}
                    name="description"
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
                    onClick={() => {
                        (onClose(), reset);
                    }}
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
    );
}
