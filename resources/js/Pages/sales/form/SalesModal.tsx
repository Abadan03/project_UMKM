interface SalesModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function SalesModal({
    isOpen,
    onClose,
    title,
    children,
}: SalesModalProps) {
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
                className="w-full max-w-2xl"
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
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                        }}
                        className="text-[#11151f] cursor-pointer text-sm font-bold w-7 h-7 flex items-center justify-center hover:bg-[#11151f] hover:text-[#5fa080]"
                        style={{
                            border: "2px solid #11151f",
                        }}
                    >
                        X
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
