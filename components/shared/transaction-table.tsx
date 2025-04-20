"use client"

import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

const transactions = [
    {
        id: 1,
        name: "Eloken Companies Payroll",
        type: "Monthly payment",
        amount: "$25,000.00",
        number: "•••• 1601",
        category: "Salary",
        date: "Jul 8, 2023",
    },
    {
        id: 2,
        name: "Upwork Payment",
        type: "Monthly payment",
        amount: "$25,000.00",
        number: "•••• 2871",
        category: "Freelance",
        date: "Jul 8, 2023",
    },
    {
        id: 3,
        name: "Amazon Marketplace",
        type: "Monthly payment",
        amount: "$25,000.00",
        number: "•••• 8548",
        category: "Business",
        date: "Jul 8, 2023",
    },
    {
        id: 4,
        name: "Coinbase BTC Sale",
        type: "Monthly payment",
        amount: "$25,000.00",
        number: "•••• 1784",
        category: "Investments",
        date: "Jul 8, 2023",
    },
    {
        id: 5,
        name: "Airbnb Payment",
        type: "Monthly payment",
        amount: "$25,000.00",
        number: "•••• 1687",
        category: "",
        date: "Jul 8, 2023",
    },
    {
        id: 6,
        name: "France Tax Authority",
        type: "Monthly payment",
        amount: "$25,000.00",
        number: "•••• 1601",
        category: "",
        date: "Jul 8, 2023",
    },
]

export function TransactionTable() {
    const [activeRowId, setActiveRowId] = useState<number | null>(null);

    const toggleActionMenu = (id: number) => {
        setActiveRowId(activeRowId === id ? null : id);
    };

    const handleClickOutside = () => {
        setActiveRowId(null);
    };

    return (
        <div className="overflow-x-auto relative" onClick={handleClickOutside}>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[#edf2f6]">
                        <th className="w-6 p-3">
                            <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="p-3 text-left font-medium text-[#8993a4] text-sm">Name</th>
                        <th className="p-3 text-right font-medium text-[#8993a4] text-sm">Amount</th>
                        <th className="p-3 text-left font-medium text-[#8993a4] text-sm">Number</th>
                        <th className="p-3 text-left font-medium text-[#8993a4] text-sm">Category</th>
                        <th className="p-3 text-left font-medium text-[#8993a4] text-sm">Date</th>
                        <th className="p-3 text-center font-medium text-[#8993a4] text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-[#edf2f6] hover:bg-[#f8f8fb]">
                            <td className="p-3">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </td>
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#356597] flex items-center justify-center text-white">
                                        <span className="text-xs">$</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{transaction.name}</div>
                                        <div className="text-xs text-[#8993a4]">{transaction.type}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 text-right font-medium">{transaction.amount}</td>
                            <td className="p-3 text-[#8993a4]">{transaction.number}</td>
                            <td className="p-3">
                                {transaction.category && (
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={`w-4 h-4 rounded-sm flex items-center justify-center ${transaction.category === "Salary"
                                                ? "bg-[#23c55e]/10"
                                                : transaction.category === "Freelance"
                                                    ? "bg-[#356597]/10"
                                                    : transaction.category === "Business"
                                                        ? "bg-[#01162c]/10"
                                                        : "bg-[#fa7a4b]/10"
                                                }`}
                                        >
                                            <span
                                                className={`text-[8px] ${transaction.category === "Salary"
                                                    ? "text-[#23c55e]"
                                                    : transaction.category === "Freelance"
                                                        ? "text-[#356597]"
                                                        : transaction.category === "Business"
                                                            ? "text-[#01162c]"
                                                            : "text-[#fa7a4b]"
                                                    }`}
                                            >
                                                $
                                            </span>
                                        </div>
                                        <span className="text-sm">{transaction.category}</span>
                                    </div>
                                )}
                            </td>
                            <td className="p-3 text-[#8993a4]">{transaction.date}</td>
                            <td className="p-3 text-center relative">
                                <button
                                    className={`text-[#8993a4] hover:text-[#01162c] ${activeRowId === transaction.id ? 'text-[#01162c]' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleActionMenu(transaction.id);
                                    }}
                                >
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>

                                {activeRowId === transaction.id && (
                                    <div
                                        className="absolute right-10 top-2 flex flex-col gap-1 bg-white shadow-md rounded-md p-1 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button className="bg-[#01162c] text-white text-xs px-3 py-1.5 rounded whitespace-nowrap hover:bg-opacity-90 transition-colors flex items-center justify-center">
                                            Edit
                                        </button>
                                        <button className="bg-[#f55f5f] text-white text-xs px-3 py-1.5 rounded whitespace-nowrap hover:bg-opacity-90 transition-colors flex items-center justify-center">
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}