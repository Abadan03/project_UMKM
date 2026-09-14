interface SalesItemsFormProps {
    data: any;
    setData: any;
    onClose: () => void;
}

export default function SalesItemsForm({
    data,
    setData,
    onClose,
}: SalesItemsFormProps) {
    const updateItem = (
        index: number,
        field: "product_id" | "quantity" | "unit_price",
        value: number,
    ) => {
        const items = [...(data.items ?? [])];

        items[index] = {
            ...items[index],
            [field]: value,
        };

        setData("items", items);
    };

    const removeItem = (index: number) => {
        setData(
            "items",
            data.items.filter((_item: any, i: number) => i !== index),
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <label className="text-[#8b93a7] text-[12px] font-bold tracking-wider">
                        SALES ITEMS
                    </label>

                    <span className="font-mono text-[9px] text-[#9aa3b5]">
                        PRODUCTS INCLUDED IN THIS SALE
                    </span>
                </div>
            </div>

            {/* ITEMS */}
            <div className="grid grid-cols-2 gap-2">
                {(data.items ?? []).map((item: any, index: number) => (
                    <div
                        key={index}
                        className="p-3 flex flex-col gap-2"
                        style={{
                            border: "3px solid #11151f",
                            boxShadow: "3px 3px 0 #11151f",
                        }}
                    >
                        {/* ITEM NUMBER */}
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] font-bold text-white">
                                ITEM #{index + 1}
                            </span>
                        </div>

                        {/* PRODUCT */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                PRODUCT NAME
                            </label>

                            <input
                                disabled
                                type="text"
                                value={item.product_name ?? ""}
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                }}
                            />
                        </div>

                        {/* QTY + PRICE */}
                        <div className="grid grid-cols-2 gap-2">
                            {/* QUANTITY */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                    QUANTITY
                                </label>

                                <input
                                    disabled
                                    type="number"
                                    min={0}
                                    value={item.quantity ?? 0}
                                    className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                    style={{
                                        border: "3px solid #11151f",
                                    }}
                                />
                            </div>

                            {/* UNIT PRICE */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                    UNIT PRICE
                                </label>

                                <input
                                    disabled
                                    type="number"
                                    min={0}
                                    value={item.unit_price ?? 0}
                                    className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                    style={{
                                        border: "3px solid #11151f",
                                    }}
                                />
                            </div>
                        </div>

                        {/* TOTAL */}
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-mono text-[9px] font-bold text-white">
                                ITEM TOTAL
                            </span>

                            <span className="font-mono text-xs font-bold text-white">
                                {(
                                    (item.quantity ?? 0) *
                                    (item.unit_price ?? 0)
                                ).toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                ))}

                {/* EMPTY STATE */}
                {(data.items ?? []).length === 0 && (
                    <div
                        className="py-8 text-center"
                        style={{
                            border: "3px dashed #11151f",
                        }}
                    >
                        <span className="font-mono text-[10px] text-[#8b93a7]">
                            NO SALE ITEMS
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
