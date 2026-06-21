import { Breadcrumbs } from '@/components/breadcrumbs'
import AppLayout from '@/layouts/app-layout'
import { InventoryProps, PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'
import { ShelvingUnit, UserIcon } from 'lucide-react';
import React from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Inventory",
        href: "/inventory",
    },
];

interface Props extends PageProps {
    inventory: InventoryProps[];
}

export default function index({inventory}: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="font-mono uppercase flex h-full w-full flex-1 flex-col gap-6 rounded-none p-6 bg-[#2e1044] text-[#ddc8f0] min-h-screen">
                <div className="border-4 border-[#1a0a2e] bg-[#3c2060] p-4 shadow-[6px_6px_0px_0px_#1a0a2e] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ffdd00] font-bold text-xl">
                        <UserIcon size={28} />
                        <h2>Inventory Management</h2>
                    </div>

                    <button
                        // onClick={() => handleRoute("create")}
                        className="border-4 border-[#1a0a2e] cursor-pointer bg-[#44cc44] px-4 py-2 font-bold text-[#1a0a2e] shadow-[4px_4px_0px_0px_#1a0a2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all active:bg-[#ffdd00]"
                    >
                        + add Inventory
                    </button>
                </div>


                {/* Table */}
                <div className="overflow-x-auto border-4 border-[#1a0a2e] bg-[#ddc8f0] shadow-[8px_8px_0px_0px_#1a0a2e]">
                    <table className="w-full text-sm text-[#1a0a2e]">
                        <thead className="bg-[#44cc44] border-b-4 border-[#1a0a2e] text-[#1a0a2e]">
                            <tr>
                                {/* Ubah Header menyesuaikan data body */}
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Product Name
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Quantity
                                </th>
                                <th className="px-4 py-4 text-left border-r-4 border-[#1a0a2e]">
                                    Pricing
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
                            {inventory.length > 0 ? (
                                inventory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                                    >
                                        <td className="px-4 py-3">
                                            {item.product?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.product?.qty}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.product?.pricing}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(
                                                item.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleRoute("edit", item.id)
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
                                                        item.id,
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
    </AppLayout>
  )
}
