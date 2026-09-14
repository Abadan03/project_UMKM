import { LoaderCircle, Search } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import {
    PageProps,
    User,
    Roles,
    UserFormData,
    type BreadcrumbItem,
    T_Staff,
    StaffFormData,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import { User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";
import { confirmDialog, notifyDialog } from "@/Pages/utils/popupModal";
import { useEffect, useMemo, useRef, useState } from "react";

import Create from "./form/Create";
import Edit from "./form/Edit";
import { Input } from "@/components/ui/input";

interface Props extends PageProps {
    staffs: T_Staff[];
    roles: Roles[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Staff",
        href: "/staff",
    },
];

export default function UsersIndex({ staffs, roles }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<T_Staff[]>([]);
    const [loading, setLoading] = useState(false);
    const searchRequestId = useRef(0);

    const [selectedUser, setSelectedUser] = useState<StaffFormData | null>(
        null,
    );
    const normalizedSearch = search.trim();
    const filteredStaff = useMemo(
        () => (normalizedSearch.length > 0 ? results : staffs),
        [normalizedSearch, results, staffs],
    );

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDialog({
            title: "Delete staff?",
            text: "Staff will be permanently removed.",
            confirmText: "Delete",
            icon: "warning",
        });

        if (!confirmed) return;

        router.delete(`staff/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                notifyDialog({
                    title: "Deleted",
                    text: "Staff account is deleted",
                    icon: "success",
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Failed!",
                    text: "Failed to delete staff.",
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
                const staff = [...staffs, ...results].find((s) => s.id === id);

                if (staff) {
                    setSelectedUser({
                        id: staff.id,
                        name: staff.name,
                        pin: staff.pin,
                        roles_id: staff.roles_id,
                        users_id: staff.users_id,
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
                `/staff/search?query=${encodeURIComponent(keyword)}`,
                { headers: { Accept: "application/json" } },
            );

            if (!res.ok) {
                throw new Error("Failed to fetch staff search results.");
            }

            const data = (await res.json()) as T_Staff[];

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
            <Head title="Staff" />
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0]">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <UserIcon size={28} />
                        <h2>Staff Management</h2>
                    </div>

                    <div className="relative ">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffdd00]" />
                        <Input
                            placeholder="Search staff . . ."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 border-4 border-[#1a0a2e] bg-[#3c2060] pl-10 font-bold text-[#ddc8f0] placeholder:text-[#a88cc7] rounded-none shadow-[4px_4px_0px_0px_#1a0a2e] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    <button
                        onClick={() => handleRoute("create")}
                        className="border-4 border-[#1a0a2e] cursor-pointer bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                    >
                        + Add Staff
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
                                        SEARCHING STAFF...
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
                                        Pin Number
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
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((staff) => (
                                        <tr
                                            key={staff.id}
                                            className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                        >
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {staff.name}
                                            </td>
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {staff.pin}
                                            </td>
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {/* {String(staff.roles_id)} */}
                                                {staff.roles &&
                                                    staff.roles.name}
                                            </td>
                                            <td className="px-4 py-3 border-r-4 border-[#1a0a2e]">
                                                {/* {new Date(
                                                    staff.created_at,
                                                ).toLocaleDateString()} */}
                                                {staff.created_at &&
                                                    new Date(
                                                        staff.created_at,
                                                    ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-center flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleRoute(
                                                            "edit",
                                                            staff.id,
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
                                                            staff.id,
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
                                            NO STAFF FOUND.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t-2 border-[#1a0a2e] bg-[#ddc8f0] text-black flex justify-between">
                        <p className="text-sm">
                            {/* {filteredStaff.length} of {staffs.length} data */}
                        </p>
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
