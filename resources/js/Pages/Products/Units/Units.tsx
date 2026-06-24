import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { confirmDialog } from "@/Pages/utils/popupModal";
import { UnitsProps } from "@/types";

import { router, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { useState } from "react";

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
    const [deleteId, setDeleteId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        code: "",
    });

    const handleDelete = async (id: string) => {
        router.delete(`/units/destroy/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Product has been deleted.");
            },
            onError: () => {
                toast.error("Failed to delete product.");
            },
        });
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post("/units/store", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success("Unit created successfully.");
            },
        });
    }

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

                <div className="flex p-5 items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            Unit Name
                        </label>
                        <input
                            type="text"
                            className="font-mono w-full text-xs text-[#1c2230] bg-gray-100 px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-[#c0566a] text-[9px] tracking-wide">
                                {errors.name}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#8b93a7] text-[10px] font-bold tracking-wider">
                            Unit Code
                        </label>
                        <input
                            type="text"
                            className="font-mono w-full text-xs text-[#1c2230] bg-gray-100 px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                            onChange={(e) => setData("code", e.target.value)}
                        />
                        {errors.code && (
                            <span className="text-[#c0566a] text-[9px] tracking-wide">
                                {errors.code}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="font-mono text-[12px] font-bold tracking-wider px-2 py-1.5 mt-auto  text-[#11151f] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60 cursor-pointer"
                        style={{
                            background: "#5fa080",
                            border: "2px solid #11151f",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#4f8a6e")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#5fa080")
                        }
                    >
                        +
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 max-h-[450px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1">
                        {units.map((unit) => (
                            <div
                                key={unit.id}
                                className="flex items-center p-3 justify-between"
                                style={{
                                    background: "#1c2230",
                                    border: "2px solid #11151f",
                                }}
                            >
                                <div>
                                    <div className="text-[#5fa080] font-bold text-sm">
                                        {unit.code}
                                    </div>

                                    <div className="text-gray-200 text-xs mt-1">
                                        {unit.name}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(unit.id)}
                                    className="font-mono text-[10px] font-bold tracking-wider px-1 text-white active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                                    style={{
                                        background: "#c0566a",
                                        border: "3px solid #11151f",
                                        boxShadow: "1px 1px 0 #11151f",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "#a8455a")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            "#c0566a")
                                    }
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>

            {/* Alert */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => {
                    if (!open) setDeleteId(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Unit?</AlertDialogTitle>

                        <AlertDialogDescription>
                            This action cannot be undone. Unit will be
                            permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    handleDelete(deleteId);
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}
