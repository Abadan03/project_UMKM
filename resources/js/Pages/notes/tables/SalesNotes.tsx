import { PaginationProps, SalesProps } from "@/types";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";

interface SalesNotesProps {
    loading: boolean;
    sales: PaginationProps<SalesProps>;
    handleRoute: (
        mode: "preview" | "search",
        table: "sales",
        id?: number,
    ) => void;
}

export default function SalesNotes({
    loading,
    sales,
    handleRoute,
}: SalesNotesProps) {
    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-auto">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#ddc8f0]/80 pt-24 backdrop-blur-[1px]">
                    <div className="flex items-center gap-3 border-4 border-[#1a0a2e] bg-[#3c2060] px-5 py-4 text-[#ffdd00] shadow-[4px_4px_0px_0px_#1a0a2e]">
                        <LoaderCircle className="h-6 w-6 animate-spin" />
                        <span className="font-bold">
                            SEARCHING SALES NOTES . . .
                        </span>
                    </div>
                </div>
            )}
            <div className="border-x-4 border-b-4 border-[#1a0a2e] bg-[#ff8800] py-2">
                <h3 className="text-center font-bold text-[#1a0a2e] text-lg">
                    Table Sales Notes
                </h3>
            </div>
            <table className="w-full table-fixed border-4 border-[#1a0a2e] text-sm bg-[#ddc8f0] text-[#1a0a2e]">
                <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                    <tr>
                        <th className="p-4 text-center">Invoice</th>
                        <th className="p-4 text-center">Type</th>
                        <th className="p-4 text-center">Date</th>
                        <th className="p-4 text-center">Cashier</th>
                        <th className="p-4 text-center">Notes</th>
                        <th className="p-4 text-center">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.data?.length > 0 ? (
                        sales.data.map((sale) => (
                            <tr
                                key={sale.id}
                                className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                            >
                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                    {sale.invoice_number}
                                </td>

                                <td className="px-4 text-center py-3 border-r-4 border-[#1a0a2e]">
                                    {sale.transactions?.[0]?.transaction_type}
                                </td>
                                <td className="px-4 text-center py-3 border-r-4 border-[#1a0a2e]">
                                    {new Date(
                                        sale.transaction_date,
                                    ).toLocaleString("id-ID")}
                                </td>

                                <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                    {sale.cashier_name ?? "-"}
                                </td>

                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                    <button
                                        onClick={() =>
                                            handleRoute(
                                                "preview",
                                                "sales",
                                                sale.id,
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <EyeOffIcon width={18} />
                                    </button>
                                </td>

                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                    {sale.transactions?.[0]?.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-4 py-8 text-center text-[#5a3888] font-bold"
                            >
                                NO SALES NOTES FOUND.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
