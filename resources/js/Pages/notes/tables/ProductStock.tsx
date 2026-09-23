import { InventoryProps, PaginationProps } from "@/types";
import { ExternalLink, EyeIcon, LoaderCircle } from "lucide-react";

interface ProductStockProps {
    loading: boolean;
    product: PaginationProps<InventoryProps>;
    handleRoute: (
        mode: "preview" | "search",
        table: "inventory",
        id?: number,
    ) => void;
}

export default function ProductStock({
    loading,
    product,
    handleRoute,
}: ProductStockProps) {
    return (
        <div className="relative flex h-full min-h-0 flex-col ">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#ddc8f0]/80 pt-24 backdrop-blur-[1px]">
                    <div className="flex items-center gap-3 border-4 border-[#1a0a2e] bg-[#3c2060] px-5 py-4 text-[#ffdd00] shadow-[4px_4px_0px_0px_#1a0a2e]">
                        <LoaderCircle className="h-6 w-6 animate-spin" />
                        <span className="font-bold">
                            SEARCHING PRODUCT STOCK . . .
                        </span>
                    </div>
                </div>
            )}
            <div className="border-x-4 border-b-4 border-[#1a0a2e] bg-[#ff8800] py-2">
                <h3 className="text-center font-bold text-[#1a0a2e] text-lg">
                    Table Low Stock Of Product
                </h3>
            </div>
            <table className="w-full table-fixed border-4 border-[#1a0a2e] text-sm bg-[#ddc8f0] text-[#1a0a2e]">
                <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                    <tr>
                        <th className="p-4 text-center ">Product Name</th>
                        <th className="p-4 text-center ">Stock</th>
                        <th className="p-4 text-center ">Minimum Stock</th>
                        <th className="p-4 text-center ">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {product.data?.length > 0 ? (
                        product.data.map((inventory) => (
                            <tr
                                key={inventory.id}
                                className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                            >
                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                    {inventory.product?.name ?? "-"}
                                </td>

                                <td className="px-4 text-center py-3 border-r-4 border-[#1a0a2e]">
                                    {inventory.qty}
                                </td>

                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                    {inventory.minimum_stock}
                                </td>

                                <td className="px-4 py-3 text-center border-r-4 border-[#1a0a2e]">
                                    <button
                                        onClick={() =>
                                            handleRoute(
                                                "preview",
                                                "inventory",
                                                inventory.products_id,
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <ExternalLink width={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-8 text-center text-[#5a3888] font-bold"
                            >
                                NO LOW STOCK OF PRODUCT FOUND.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
