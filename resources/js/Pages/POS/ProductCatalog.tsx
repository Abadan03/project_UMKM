import { Search, Maximize, Minimize } from "lucide-react";
import type { ProductProps } from "@/types";

interface ProductCatalogProps {
    isMaximized: boolean;
    onFullscreenToggle: (value: boolean) => void;
    products: ProductProps[];
    categories: string[];
    category: string;
    query: string;
    cart: Record<number, number>;
    hasCheckedOut: boolean;
    onCategoryChange: (category: string) => void;
    onQueryChange: (query: string) => void;
    onAddToCart: (productId: number) => void;
    formatCurrency: (amount: number) => string;
}

const stockStatusStyle = {
    Unavailable: {
        label: "Unavailable",
        className:
            "p-1 rounded-xl bg-red-100 text-red-700 border-2 border-red-700 ",
    },
    Warning: {
        label: "Warning",
        className:
            "p-1 rounded-xl bg-yellow-100 text-yellow-800 border-2 border-yellow-700 ",
    },
    Available: {
        label: "Available",
        className:
            "p-1 rounded-xl bg-green-100 text-green-700 border-2 border-green-700 ",
    },
};

export default function ProductCatalog({
    isMaximized,
    onFullscreenToggle,
    products,
    categories,
    category,
    query,
    cart,
    hasCheckedOut,
    onCategoryChange,
    onQueryChange,
    onAddToCart,
    formatCurrency,
}: ProductCatalogProps) {
    const filteredProducts = products.filter((product) => {
        const inCategory =
            category === "Semua" || product.categories?.name === category;
        return (
            inCategory &&
            product.name.toLowerCase().includes(query.toLowerCase())
        );
    });

    return (
        <main className="flex-1 p-5 flex flex-col min-h-0">
            <div className="flex items-center mb-4 gap-2 ">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C82]" />
                    <input
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Cari menu..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9D2BF] bg-white text-sm placeholder:text-[#A3AFA6] focus:outline-none focus:ring-2 focus:ring-[#E3A23C]"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        void onFullscreenToggle(!isMaximized);
                    }}
                    aria-label={
                        isMaximized
                            ? "Keluar dari fullscreen"
                            : "Aktifkan fullscreen"
                    }
                    title={
                        isMaximized
                            ? "Keluar dari fullscreen"
                            : "Aktifkan fullscreen"
                    }
                    className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
                >
                    {!isMaximized ? (
                        <Maximize className="cursor-pointer" />
                    ) : (
                        <Minimize className="cursor-pointer" />
                    )}
                </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() => onCategoryChange(item)}
                        className={`px-3.5 py-1.5 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                            category === item
                                ? "bg-[#132621] text-white"
                                : "bg-white text-[#5A6B60] border border-[#D9D2BF] hover:border-[#132621]"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="grid min-h-0 flex-1 content-start auto-rows-max grid-cols-2 p-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-1">
                {filteredProducts.map((product) => {
                    const quantityInCart = cart[product.id] || 0;
                    const stockQuantity = Number(product.inventory?.qty ?? 0);
                    const status =
                        stockStatusStyle[product.stock_status ?? "Unavailable"];

                    return (
                        <button
                            key={product.id}
                            onClick={() => onAddToCart(product.id)}
                            disabled={hasCheckedOut || stockQuantity <= 0}
                            aria-disabled={stockQuantity <= 0}
                            className={`relative text-left bg-white border rounded-xl p-3 transition-transform ${
                                stockQuantity <= 0
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer active:scale-[0.97]"
                            } ${
                                quantityInCart > 0
                                    ? "border-[#E3A23C] ring-1 ring-[#E3A23C]"
                                    : "border-[#D9D2BF]"
                            }`}
                        >
                            {quantityInCart > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#E3A23C] text-[#132621] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                                    {quantityInCart}
                                </span>
                            )}

                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-[#7C8C82]">
                                    {product.categories?.name}
                                </p>
                                <p className={`text-xs ${status?.className}`}>
                                    {status?.label}
                                </p>
                            </div>
                            <p className="font-medium text-sm leading-snug mb-2">
                                {product.name}
                            </p>
                            <p className="font-mono text-sm leading-snug mb-2">
                                Stock : {product.inventory?.qty}
                            </p>
                            <p className="font-mono text-sm font-semibold text-[#132621]">
                                {formatCurrency(product.sell_price)}
                            </p>
                        </button>
                    );
                })}
                {filteredProducts.length === 0 && (
                    <p className="col-span-full text-center text-sm text-[#7C8C82] py-10">
                        Menu tidak ditemukan.
                    </p>
                )}
            </div>
        </main>
    );
}
