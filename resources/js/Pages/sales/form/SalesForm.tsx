import { useState } from "react";

import SalesTransactionForm from "./SalesTransaction";
import SalesItemsForm from "./SalesItems";

interface SalesFormProps {
    data: any;
    setData: any;
    processing: boolean;
    errors: any;
    onClose: () => void;
}

export default function SalesForm({ data, setData, onClose }: SalesFormProps) {
    const [indicator, setIndicator] = useState<"sales" | "items">("sales");

    return (
        <div className="px-4 py-5">
            {/* TABS */}
            <div
                className="flex gap-2 pb-2 mb-2"
                style={{
                    borderBottom: "3px solid #11151f",
                }}
            >
                {/* GENERAL INFO */}
                <button
                    type="button"
                    onClick={() => setIndicator("sales")}
                    className={`
                        font-mono text-[10px] font-bold tracking-wider
                        px-5 py-3 cursor-pointer
                        transition-none
                        ${
                            indicator === "sales"
                                ? "text-[#11151f]"
                                : "text-[#8b93a7]"
                        }
                    `}
                    style={
                        indicator === "sales"
                            ? {
                                  background: "#e6b85c",
                                  border: "3px solid #11151f",
                              }
                            : {
                                  background: "#eef1f6",
                                  border: "3px solid #11151f",
                              }
                    }
                >
                    GENERAL INFO
                </button>

                {/* ITEM INFO */}
                <button
                    type="button"
                    onClick={() => setIndicator("items")}
                    className={`
                        font-mono text-[10px] font-bold tracking-wider
                        px-5 py-3 cursor-pointer
                        transition-none
                        ${
                            indicator === "items"
                                ? "text-[#11151f]"
                                : "text-[#8b93a7]"
                        }
                    `}
                    style={
                        indicator === "items"
                            ? {
                                  background: "#e6b85c",
                                  border: "3px solid #11151f",
                              }
                            : {
                                  background: "#eef1f6",
                                  border: "3px solid #11151f",
                              }
                    }
                >
                    ITEM INFO
                </button>
            </div>

            {/* TAB CONTENT */}
            {indicator === "sales" && (
                <SalesTransactionForm data={data} onClose={onClose} />
            )}

            {indicator === "items" && (
                <SalesItemsForm
                    data={data}
                    setData={setData}
                    onClose={onClose}
                />
            )}
        </div>
    );
}
