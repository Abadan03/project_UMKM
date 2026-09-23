import { LoaderCircle, Search } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import {
    PageProps,
    User,
    Roles,
    UserFormData,
    type BreadcrumbItem,
    PaginationProps,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import { User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";
import { confirmDialog, notifyDialog } from "@/Pages/utils/popupModal";
import { useEffect, useMemo, useRef, useState } from "react";

import Create from "./form/Create";
import Edit from "./form/Edit";
import { Input } from "@/components/ui/input";
import PaginationWrapper from "@/components/pagination";

interface Props extends PageProps {
    users: PaginationProps<User>;
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
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const searchRequestId = useRef(0);

    const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
    const normalizedSearch = search.trim();
    const filteredUsers = useMemo(
        () => (normalizedSearch.length > 0 ? results : users.data),
        [normalizedSearch, results, users.data],
    );

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
                notifyDialog({
                    title: "Deleted",
                    text: "User account is deleted",
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
                const user = [...users.data, ...results].find(
                    (u) => u.id === id,
                );

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

    const fetchResults = async (searchValue: string) => {
        const keyword = searchValue.trim();
        const requestId = searchRequestId.current + 1;
        searchRequestId.current = requestId;

        if (!keyword) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `/users/search?query=${encodeURIComponent(keyword)}`,
                { headers: { Accept: "application/json" } },
            );

            if (!res.ok) {
                throw new Error("Failed to fetch user search results.");
            }

            const payload = (await res.json()) as User[] | { data?: User[] };

            const data = Array.isArray(payload)
                ? payload
                : (payload?.data ?? []);

            if (searchRequestId.current === requestId) {
                setResults(data);
            }
        } catch (error) {
            if (searchRequestId.current === requestId) {
                console.error(error);
                setResults([]);
            }
        } finally {
            if (searchRequestId.current === requestId) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        searchRequestId.current += 1;

        const delay = setTimeout(() => {
            if (search.length > 0) {
                fetchResults(search);
            } else {
                setResults([]);
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0]">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <UserIcon size={28} />
                        <h2>User Management</h2>
                    </div>

                    <div className="relative ">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffdd00]" />
                        <Input
                            placeholder="Search user . . ."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 border-4 border-[#1a0a2e] bg-[#3c2060] pl-10 font-bold text-[#ddc8f0] placeholder:text-[#a88cc7] rounded-none shadow-[4px_4px_0px_0px_#1a0a2e] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    <button
                        onClick={() => handleRoute("create")}
                        className="border-4 border-[#1a0a2e] cursor-pointer bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                    >
                        + Add User
                    </button>
                </div>

                {/* Table */}
                <div className="border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e] flex flex-col h-full">
                    <div className="relative min-h-[360px] overflow-x-auto flex-1">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#ddc8f0]/80 pt-24 backdrop-blur-[1px]">
                                <div className="flex items-center gap-3 border-4 border-[#1a0a2e] bg-[#3c2060] px-5 py-4 text-[#ffdd00] shadow-[4px_4px_0px_0px_#1a0a2e]">
                                    <LoaderCircle className="h-6 w-6 animate-spin" />
                                    <span className="font-bold">
                                        SEARCHING USERS...
                                    </span>
                                </div>
                            </div>
                        )}
                        <table className="w-full table-fixed text-sm text-[#1a0a2e]">
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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                        >
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {String(user.role)}
                                            </td>
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-center flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleRoute(
                                                            "edit",
                                                            user.id,
                                                        )
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
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-[#5a3888] font-bold"
                                        >
                                            NO USERS FOUND.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex shrink-0 items-center justify-between border-t-4 border-[#1a0a2e] bg-[#ddc8f0] px-4 py-3 text-black">
                        <p className="text-sm">
                            {filteredUsers.length} of {users.data.length} data
                        </p>
                        <div>
                            <PaginationWrapper
                                currentPage={users.current_page}
                                totalPages={users.last_page}
                                onPageChange={(page) =>
                                    router.get(
                                        `/users?page=${page}`,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                getPageHref={(page) => `/users?page=${page}`}
                            />
                        </div>
                    </div>
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
