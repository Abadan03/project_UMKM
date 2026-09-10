import { Roles, T_Staff, UserFormData, StaffFormData } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { redirectDialog } from "@/Pages/utils/popupModal";

interface Props {
    initialData?: T_Staff;
    submitUrl: string;
    roles: Roles[];
    method?: "post" | "put";
    onClose: () => void;
}

export default function UserForm({
    initialData,
    submitUrl,
    roles,
    method = "post",
    onClose,
}: Props) {
    const auth = usePage().props.auth as any;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<StaffFormData>({
            id: initialData?.id ?? 0,
            name: initialData?.name ?? "",
            pin: initialData?.pin ?? "",
            roles_id: initialData?.roles_id ?? 3,
            users_id: auth.user.id,
        });

    const [changePassword, setChangePassword] = useState(false);

    const handleBack = () => {
        router.visit("/staff", { replace: true });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const action = method === "post" ? post : put;

        action(submitUrl, {
            preserveScroll: true,

            onSuccess: async () => {
                const confirmed = await redirectDialog({
                    title: "Success",
                    text:
                        method === "post"
                            ? "Success add new data. Do you want to add more data ?"
                            : "Data updated successfully. Tetap di halaman ini?",
                    confirmText: "Open it up",
                    cancelText: "Close form",
                    icon: "success",
                });

                if (!confirmed) {
                    handleBack();
                    return;
                }

                if (method === "post") {
                    reset();
                }

                clearErrors();
                setChangePassword(false);
            },
        });
    };

    return (
        <form onSubmit={submit} className=" space-y-5">
            {/* Row 1: Name + Role */}
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                        style={{
                            border: "3px solid #11151f",
                            boxShadow: "3px 3px 0 #11151f",
                        }}
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                        Pin Number
                    </label>
                    <input
                        type="text"
                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                        style={{
                            border: "3px solid #11151f",
                            boxShadow: "3px 3px 0 #11151f",
                        }}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        minLength={4}
                        maxLength={4}
                        value={data.pin}
                        onChange={(e) => {

                            const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                            setData("pin", val)
                         }
                        }

                    />
                    {errors.pin && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.pin}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                        Role
                    </label>
                    <select
                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                        style={{
                            border: "3px solid #11151f",
                            boxShadow: "3px 3px 0 #11151f",
                        }}
                        value={data.roles_id}
                        onChange={(e) =>
                            setData("roles_id", Number(e.target.value))
                        }
                    >
                        {roles?.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.roles_id && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.roles_id}
                        </p>
                    )}
                </div>
            </div>

            {/* Row 2: Email */}

            {/* CREATE MODE */}
            {method === "post" && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                            {/* <div>
                                <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                    style={{
                                        border: "3px solid #11151f",
                                        boxShadow: "3px 3px 0 #11151f",
                                    }}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div> */}
                        {/* <div>
                            <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                style={{
                                    border: "3px solid #11151f",
                                    boxShadow: "3px 3px 0 #11151f",
                                }}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div> */}
                    </div>
                </>
            )}

            {/* EDIT MODE */}
            {method === "put" && (
                <>
                    <div className="flex text-[#8b93a7] items-center gap-2">
                        <input
                            id="change-password"
                            type="checkbox"
                            checked={changePassword}
                            onChange={(e) => {
                                setChangePassword(e.target.checked);
                                setData("pin", e.target.checked ? "" : initialData?.pin ?? "");
                            }}
                        />
                        <label htmlFor="change-password">Update Pin</label>
                    </div>

                    {changePassword && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                        Old Pin
                                    </label>
                                    <input
                                        type="password"
                                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                        style={{
                                            border: "3px solid #11151f",
                                            boxShadow: "3px 3px 0 #11151f",
                                        }}
                                        value={data.old_pin}
                                        onChange={(e) =>
                                            setData(
                                                "old_pin",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.old_pin && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.old_pin}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                        New Pin
                                    </label>
                                    <input
                                        type="password"
                                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                        style={{
                                            border: "3px solid #11151f",
                                            boxShadow: "3px 3px 0 #11151f",
                                        }}
                                        value={data.pin}
                                        onChange={(e) =>
                                            setData("pin", e.target.value)
                                        }
                                    />
                                    {errors.pin && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.pin}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                        Confirm Pin
                                    </label>
                                    <input
                                        type="password"
                                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                        style={{
                                            border: "3px solid #11151f",
                                            boxShadow: "3px 3px 0 #11151f",
                                        }}
                                        value={data.pin}
                                        onChange={(e) =>
                                            setData(
                                                "pin",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.pin && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.pin}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleBack}
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
                    Back
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
                    {processing ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}
