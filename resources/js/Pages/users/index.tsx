import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import {
    PageProps,
    User,
    Roles,
    UserFormData,
    type BreadcrumbItem,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import { User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";
import { confirmDialog } from "@/Pages/utils/popupModal";
import { useState } from "react";

import Create from "./form/Create";
import Edit from "./form/Edit";

interface Props extends PageProps {
    users: User[];
    roles: Roles[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Users",
        href: "/users",
    },
];

export default function UsersIndex({ users, roles }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
    const handleDelete = async (id: number) => {
        const confirmed = await confirmDialog({
            title: "Delete user?",
            text: "User will be permanently removed.",
            confirmText: "Delete",
            icon: "warning",
        });

        if (!confirmed) return;

        router.delete(`users/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: "Deleted!",
                    text: "User has been deleted.",
                    icon: "success",
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Failed!",
                    text: "Failed to delete user.",
                    icon: "error",
                });
            },
        });
    };

    const handleRoute = (mode: "create" | "edit" | "delete", id?: number) => {
        switch (mode) {
            case "create":
                setShowCreate(true);
                break;

            case "edit":
                const user = users.find((u) => u.id === id);

                if (user) {
                    setSelectedUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        roles_id: user.roles_id,
                    });

                    setShowEdit(true);
                }

                break;

            case "delete":
                handleDelete(id!);
                break;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0] min-h-screen">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <UserIcon size={28} />
                        <h2>User Management</h2>
                    </div>

                    <button
                        onClick={() => handleRoute("create")}
                        className="border-4 border-[#1a0a2e] cursor-pointer bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                    >
                        + Add User
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e]">
                    <table className="w-full text-sm text-[#1a0a2e]">
                        <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                            <tr>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Name
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Email
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Role
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Created_at
                                </th>
                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                    >
                                        <td className="px-4 py-3">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {String(user.role)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleRoute("edit", user.id)
                                                }
                                                className="border-2 cursor-pointer rounded-none border-[#1a0a2e] bg-[#44ddff] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#2288cc]"
                                            >
                                                Edit
                                            </button>
                                            &nbsp;
                                            <button
                                                onClick={() =>
                                                    handleRoute(
                                                        "delete",
                                                        user.id,
                                                    )
                                                }
                                                className="border-2 cursor-pointer border-[#1a0a2e] bg-[#ff44aa] px-3 py-1 text-sm font-bold text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1a0a2e] active:bg-[#ff4444]"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* modal */}
            <Create
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                roles={roles}
            />
            {selectedUser && (
                <Edit
                    isOpen={showEdit}
                    onClose={() => {
                        setShowEdit(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    roles={roles}
                />
            )}
        </AppLayout>
    );
}
