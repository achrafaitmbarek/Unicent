import { ChevronDown, MoreHorizontal, ThumbsDown, ThumbsUp, Check } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function SmartBudgetsPage() {
    return (
        <>
            <div className="flex flex-1 flex-col">
                <main className="flex-1 p-4 md:p-6">
                    <h1 className="mb-6 text-2xl font-bold text-[#01162c]">AI Budget Recommendations</h1>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-[#e6ecf2] bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#01162c]">Insights Summary</h2>
                                    <p className="text-sm text-[#8993a4]">Total Spending</p>
                                </div>
                                <button className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-lg border-l-4 border-[#1c60e8] bg-[#f3f7ff] p-4">
                                    <h3 className="mb-2 text-sm font-medium text-[#01162c]">Current</h3>
                                    <p className="mb-1 text-xl font-bold text-[#01162c]">$3320.00</p>
                                    <div className="flex items-center text-xs font-medium text-[#00b158]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1 h-3 w-3"
                                        >
                                            <path d="m5 12 7-7 7 7" />
                                            <path d="M12 19V5" />
                                        </svg>
                                        +4,85%
                                    </div>
                                    <div className="mt-2 h-8 w-full">
                                        <svg viewBox="0 0 100 20" className="h-full w-full">
                                            <path
                                                d="M0,10 Q10,5 20,8 T40,6 T60,10 T80,8 T100,10"
                                                fill="none"
                                                stroke="#1c60e8"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="rounded-lg border-l-4 border-[#fa16d6] bg-[#fff3fd] p-4">
                                    <h3 className="mb-2 text-sm font-medium text-[#01162c]">Recommended</h3>
                                    <p className="mb-1 text-xl font-bold text-[#01162c]">$3100.00</p>
                                    <div className="flex items-center text-xs font-medium text-[#00b158]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1 h-3 w-3"
                                        >
                                            <path d="m5 12 7-7 7 7" />
                                            <path d="M12 19V5" />
                                        </svg>
                                        +4,85%
                                    </div>
                                    <div className="mt-2 h-8 w-full">
                                        <svg viewBox="0 0 100 20" className="h-full w-full">
                                            <path
                                                d="M0,10 Q10,5 20,8 T40,6 T60,10 T80,8 T100,10"
                                                fill="none"
                                                stroke="#fa16d6"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="rounded-lg border-l-4 border-[#23c55e] bg-[#f4fcf7] p-4">
                                    <h3 className="mb-2 text-sm font-medium text-[#01162c]">Potential Savings</h3>
                                    <p className="mb-1 text-xl font-bold text-[#01162c]">$330.00</p>
                                    <div className="flex items-center text-xs font-medium text-[#00b158]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1 h-3 w-3"
                                        >
                                            <path d="m5 12 7-7 7 7" />
                                            <path d="M12 19V5" />
                                        </svg>
                                        +4,85%
                                    </div>
                                    <div className="mt-2 h-8 w-full">
                                        <svg viewBox="0 0 100 20" className="h-full w-full">
                                            <path
                                                d="M0,10 Q10,5 20,8 T40,6 T60,10 T80,8 T100,10"
                                                fill="none"
                                                stroke="#23c55e"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#e6ecf2] bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-[#01162c]">Today AI Personalized Tip</h2>
                                <button className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#f3f7ff]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6 text-[#1c60e8]"
                                    >
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                        <path d="M12 9v4" />
                                        <path d="M12 17h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-[#01162c]">
                                        Your transport costs are 23.14% of expenses. Taking public transit could save you approximately
                                        €200/month on fuel
                                    </p>
                                    <p className="mt-2 text-sm text-[#8993a4]">
                                        Parking, and maintenance. Popular routes in your area have frequent service from 6AM-11PM.
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <button className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]">
                                            <ThumbsUp className="h-5 w-5" />
                                        </button>
                                        <button className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]">
                                            <ThumbsDown className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg border border-[#e6ecf2] bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#01162c]">Category-wise Recommendations</h2>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 text-[#01162c]">
                                All Categories
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-[#e6ecf2] hover:bg-transparent">
                                        <TableHead className="w-8 py-3">
                                            <div className="flex h-5 w-5 items-center justify-center rounded border border-[#e6ecf2]"></div>
                                        </TableHead>
                                        <TableHead className="py-3 text-left text-sm font-medium text-[#01162c]">Name</TableHead>
                                        <TableHead className="py-3 text-left text-sm font-medium text-[#01162c]">Current</TableHead>
                                        <TableHead className="py-3 text-left text-sm font-medium text-[#01162c]">Recommended</TableHead>
                                        <TableHead className="py-3 text-left text-sm font-medium text-[#01162c]">Difference</TableHead>
                                        <TableHead className="py-3 text-left text-sm font-medium text-[#01162c]">Date</TableHead>
                                        <TableHead className="py-3 text-left text-sm font-medium text-[#01162c]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-b border-[#e6ecf2]">
                                        <TableCell className="py-3">
                                            <div className="flex h-5 w-5 items-center justify-center rounded border border-[#e6ecf2] bg-[#23c55e] text-white">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-sm font-medium text-[#01162c]">Food</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">$600</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">$500</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">20%</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">Jul 8, 2023</TableCell>
                                        <TableCell className="py-3">
                                            <span className="rounded-full bg-[#f4fcf7] px-3 py-1 text-xs font-medium text-[#00b158]">
                                                Low Priority
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="border-b border-[#e6ecf2]">
                                        <TableCell className="py-3">
                                            <div className="flex h-5 w-5 items-center justify-center rounded border border-[#e6ecf2]"></div>
                                        </TableCell>
                                        <TableCell className="py-3 text-sm font-medium text-[#01162c]">Transportation</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">$360</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">$250</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">15%</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">Jul 8, 2023</TableCell>
                                        <TableCell className="py-3">
                                            <span className="rounded-full bg-[#fff3fd] px-3 py-1 text-xs font-medium text-[#b2910f]">
                                                Medium Priority
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="py-3">
                                            <div className="flex h-5 w-5 items-center justify-center rounded border border-[#e6ecf2]"></div>
                                        </TableCell>
                                        <TableCell className="py-3 text-sm font-medium text-[#01162c]">Entertainment</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">$200</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">$140</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">25%</TableCell>
                                        <TableCell className="py-3 text-sm text-[#01162c]">Jul 8, 2023</TableCell>
                                        <TableCell className="py-3">
                                            <span className="rounded-full bg-[#fff1ed] px-3 py-1 text-xs font-medium text-[#fc4b53]">
                                                High Priority
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}