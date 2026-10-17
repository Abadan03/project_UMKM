import { Logs } from "@/types";

interface MovementLogsProps {
    selectedLogsInventory: Logs[];
}

export default function MovementLogs({
    selectedLogsInventory,
}: MovementLogsProps) {
    return (
        <table className="w-full min-w-[1400px] table-fixed text-sm text-[#1a0a2e]">
            <colgroup>
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[9%]" />
                <col className="w-[7%]" />
                <col className="w-[7%]" />
                <col className="w-[7%]" />
                <col className="w-[20%]" />
                <col className="w-[10%]" />
                <col className="w-[14%]" />
            </colgroup>
            <thead className="sticky top-0 z-[1] border-b-4 border-[#1a0a2e] bg-[#44cc44]">
                <tr>
                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Product Name
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Actor
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Type
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Qty
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Before
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        After
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Description
                    </th>

                    <th className="border-r-4 border-[#1a0a2e] px-4 py-3">
                        Old Cost Price/HPP
                    </th>

                    <th className="px-4 py-3">
                        Date
                    </th>
                </tr>
            </thead>

            <tbody>
                {selectedLogsInventory.length > 0 ? (
                    selectedLogsInventory.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b-4 border-[#1a0a2e] hover:bg-[#b898d8]"
                        >
                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.product?.name}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.user?.name}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.module?.name}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3 text-right">
                                {item.new_value - item.old_value}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3 text-right">
                                {item.old_value}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3 text-right">
                                {item.new_value}
                            </td>

                            <td className="break-words border-r-4 border-[#1a0a2e] px-4 py-3">
                                {item.description}
                            </td>

                            <td className="border-r-4 border-[#1a0a2e] px-4 py-3 text-right">
                                Rp{" "}
                                {Number.isNaN(Number(item.old_hpp))
                                    ? "-"
                                    : Number(item.old_hpp).toLocaleString(
                                          "id-ID",
                                      )}
                            </td>

                            <td className="px-4 py-3 text-right">
                                {item.created_at &&
                                    new Date(item.created_at).toLocaleString(
                                        "id-ID",
                                    )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={9}
                            className="px-4 py-8 text-center font-bold text-[#5a3888]"
                        >
                            NO LOGS STOCK FOUND.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
