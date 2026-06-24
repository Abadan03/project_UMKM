import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from "@/components/ui/dialog";
import { UnitsProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";

interface Unit {
    id: number;
    code: string;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateUnitModal({ isOpen, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        code: "",
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay
                className="fixed inset-0"
                style={{
                    background: "rgba(17, 21, 31, 0.85)",
                }}
            />

            <DialogContent
                showCloseButton={false}
                className="max-w-2xl p-0 gap-0 border-0 rounded-none"
                style={{
                    background: "#2a3142",
                    border: "4px solid #11151f",
                    boxShadow: "6px 6px 0 #11151f",
                }}
            >
                {/* Header */}
                <DialogHeader
                    className="px-4 py-3"
                    style={{
                        background: "#5fa080",
                        borderBottom: "4px solid #11151f",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-[#11151f] text-sm font-bold tracking-widest">
                                CREATE UNIT
                            </DialogTitle>

                            <p className="text-[#1c2230] text-[10px] tracking-wider mt-1">
                                &gt; FILL ALL FIELDS &lt;
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
                </DialogHeader>

                <div className="flex gap-2 p-4">
                    <div className="space-y-2">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            Unit Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            Unit Code
                        </label>
                        <input
                            type="text"
                            value={data.code}
                            className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            onChange={(e) => setData("code", e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-2 p-2 px-4">
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
            </DialogContent>
        </Dialog>
    );
}
