import { Roles, UserFormData } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { redirectDialog } from "@/Pages/utils/popupModal";

interface Props {
    initialData?: UserFormData;
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
        useForm<UserFormData>({
            id: initialData?.id ?? 0,
            name: initialData?.name ?? "",
            email: initialData?.email ?? "",
            roles_id: initialData?.roles_id ?? roles[0]?.id ?? 3,
            change_password: false,
            old_password: "",
            password: "",
            password_confirmation: "",
        });

    const [changePassword, setChangePassword] = useState(false);

    const handleBack = () => {
        router.visit("/users", { replace: true });
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
                            ? "Data berhasil dibuat. Apakah ingin menambah data lagi?"
                            : "Data berhasil diperbarui. Tetap di halaman ini?",
                    confirmText: "Stay here",
                    cancelText: "Back to Index",
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
                        Email
                    </label>
                    <input
                        type="email"
                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                        style={{
                            border: "3px solid #11151f",
                            boxShadow: "3px 3px 0 #11151f",
                        }}
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.email}
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
                        {roles.map((role) => (
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
                        <div>
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
                        </div>
                        <div>
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
                        </div>
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
                                setData("change_password", e.target.checked);
                            }}
                        />
                        <label htmlFor="change-password">Update Password</label>
                    </div>

                    {changePassword && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                        Old Password
                                    </label>
                                    <input
                                        type="password"
                                        className="font-mono w-full text-xs text-[#1c2230] bg-white px-3 py-2 outline-none placeholder:text-[#9aa3b5] focus:bg-[#eef1f6]"
                                        style={{
                                            border: "3px solid #11151f",
                                            boxShadow: "3px 3px 0 #11151f",
                                        }}
                                        value={data.old_password}
                                        onChange={(e) =>
                                            setData(
                                                "old_password",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.old_password && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.old_password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[#8b93a7] text-sm font-medium mb-1">
                                        New Password
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
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
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
