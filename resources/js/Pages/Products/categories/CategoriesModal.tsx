import { useState } from "react";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    createContent: React.ReactNode;
    listContent: React.ReactNode;
}

export default function CategoriesModal({
    isOpen,
    onClose,
    title,
    subtitle,
    createContent,
    listContent,
}: ProductModalProps) {
    const [view, setView] = useState<"create" | "list">("create");
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center font-mono px-4 ${
                isOpen ? "flex" : "hidden"
            }`}
            style={{
                background: "rgba(17, 21, 31, 0.85)",
            }}
        >
            <div
                className="w-full max-w-md"
                style={{
                    background: "#2a3142",
                    border: "4px solid #11151f",
                    boxShadow: "6px 6px 0 #11151f",
                }}
            >
                <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                        background: "#5fa080",
                        borderBottom: "4px solid #11151f",
                    }}
                >
                    <div>
                        <h2 className="text-[#11151f] text-sm font-bold tracking-widest">
                            {view === "create" ? title : "LIST CATEGORIES"}
                        </h2>

                        <p className="text-[#1c2230] text-[10px] tracking-wider mt-1">
                            {view === "create"
                                ? subtitle
                                : "> ALL CATEGORIES <"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#11151f] cursor-pointer text-sm font-bold w-7 h-7 flex items-center justify-center hover:bg-[#11151f] hover:text-[#5fa080]"
                        style={{
                            border: "2px solid #11151f",
                        }}
                    >
                        X
                    </button>
                </div>

                <div className="mt-4 ml-4 flex items-center justify-start gap-2">
                    <button
                        type="button"
                        onClick={() => setView("create")}
                        aria-pressed={view === "create"}
                        className={`cursor-pointer text-sm font-bold flex items-center justify-center text-[#5fa080] hover:text-[#8b93a7] ${view === "create" ? "underline underline-offset-4" : ""}`}
                    >
                        Create Category
                    </button>
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        aria-pressed={view === "list"}
                        className={`cursor-pointer text-sm font-bold flex items-center justify-center text-[#5fa080] hover:text-[#8b93a7] ${view === "list" ? "underline underline-offset-4" : ""}`}
                    >
                        List Category
                    </button>
                </div>

                {view === "create" ? createContent : listContent}
            </div>
        </div>
    );
}
