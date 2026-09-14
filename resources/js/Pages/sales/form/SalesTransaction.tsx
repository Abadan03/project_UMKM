interface SalesTransactionFormProps {
    data: any;
    onClose: () => void;
}

export default function SalesTransactionForm({
    data,
    onClose,
}: SalesTransactionFormProps) {
    const formatDateTimeLocal = (date: string) => {
        if (!date) return "";

        return new Date(date)
            .toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
            })
            .slice(0, 16);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                {/* ==================== SALES ==================== */}

                <div className="flex flex-col gap-3">
                    <label className="text-[#8b93a7] text-[12px] font-bold tracking-wider">
                        SALES INFORMATION
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Cashier NAME */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                CASHIER NAME
                            </label>

                            <input
                                type="text"
                                disabled
                                value={data.customer_name ?? ""}
                                placeholder="Customer name"
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                        </div>
                        {/* CUSTOMER NAME */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                CUSTOMER NAME
                            </label>

                            <input
                                type="text"
                                disabled
                                value={data.customer_name ?? ""}
                                placeholder="Customer name"
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                        </div>
                    </div>

                    {/* TRANSACTION DATE */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            TRANSACTION DATE
                        </label>

                        <div
                            className="font-mono text-xs text-[#1c2230] bg-[#eef1f6] px-3 py-2"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        >
                            {formatDateTimeLocal(data.transaction_date)}
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="grid grid-cols-3 gap-2">
                        {/* SUBTOTAL */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                SUBTOTAL
                            </label>

                            <input
                                disabled
                                type="number"
                                min={0}
                                value={data.subtotal ?? 0}
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                        </div>

                        {/* DISCOUNT */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                DISCOUNT
                            </label>

                            <input
                                disabled
                                type="number"
                                min={0}
                                value={data.discount ?? 0}
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                        </div>

                        {/* TAX */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                TAX
                            </label>

                            <input
                                disabled
                                type="number"
                                min={0}
                                value={data.tax ?? 0}
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                        </div>
                    </div>

                    {/* NOTES */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            NOTES
                        </label>

                        <textarea
                            disabled
                            value={data.notes ?? ""}
                            placeholder="Sales notes"
                            rows={3}
                            className="font-mono text-[11px] text-[#1c2230] bg-white px-3 py-2 outline-none resize-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        />
                    </div>
                </div>

                {/* ==================== TRANSACTION ==================== */}

                <div className="flex flex-col gap-3">
                    <label className="text-[#8b93a7] text-[12px] font-bold tracking-wider">
                        TRANSACTION INFORMATION
                    </label>

                    {/* TYPE + AMOUNT */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* TYPE */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                TYPE
                            </label>

                            <input
                                disabled
                                value={
                                    data.transactions?.transaction_type ?? ""
                                }
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            ></input>
                        </div>

                        {/* AMOUNT */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                                AMOUNT
                            </label>

                            <input
                                disabled
                                type="number"
                                min={0}
                                value={data.transactions?.amount ?? 0}
                                className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                            />
                        </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            PAYMENT METHOD
                        </label>

                        <input
                            disabled
                            value={data.transactions?.payment_method ?? ""}
                            className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        ></input>
                    </div>

                    {/* REFERENCE NUMBER */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            REFERENCE NUMBER
                        </label>

                        <input
                            disabled
                            type="text"
                            value={data.transactions?.reference_number ?? ""}
                            placeholder="Optional"
                            className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        />
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            STATUS
                        </label>

                        <input
                            type="text"
                            disabled
                            value={data.transactions?.status ?? ""}
                            className="font-mono text-xs text-[#1c2230] bg-white px-3 py-2 outline-none focus:bg-[#eef1f6]"
                            style={{
                                border: "3px solid #11151f",
                                boxShadow: "3px 3px 0 #11151f",
                            }}
                        ></input>
                    </div>
                </div>
            </div>
        </div>
    );
}
