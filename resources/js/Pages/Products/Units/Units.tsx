import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from "@/components/ui/dialog";
import { UnitsProps } from "@/types";

import { usePage } from "@inertiajs/react";

interface Unit {
    id: number;
    code: string;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function UnitModal({ isOpen, onClose }: Props) {
    const { units } = usePage<{ units: UnitsProps[] }>().props;

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
                                UNIT LIST
                            </DialogTitle>

                            <p className="text-[#1c2230] text-[10px] tracking-wider mt-1">
                                &gt; AVAILABLE UNITS &lt;
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

                {/* Content */}
                <div className="p-5 max-h-[450px] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-1">
                        {units.map((unit) => (
                            <div
                                key={unit.id}
                                className="p-3"
                                style={{
                                    background: "#1c2230",
                                    border: "2px solid #11151f",
                                }}
                            >
                                <div className="text-[#5fa080] font-bold text-sm">
                                    {unit.code}
                                </div>

                                <div className="text-gray-200 text-xs mt-1">
                                    {unit.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
