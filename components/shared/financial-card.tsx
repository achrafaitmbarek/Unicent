import { DollarSign } from "lucide-react"

interface FinancialCardProps {
    icon: "dollar" | "expense" | "income" | "balance"
    title: string
    amount: string
    percentage: string
    isPositive: boolean
}

export function FinancialCard({ icon, title, amount, percentage, isPositive }: FinancialCardProps) {
    return (
        <div className="rounded-lg bg-white p-4">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2f6]">
                    {icon === "dollar" && <DollarSign className="h-4 w-4 text-[#01162c]" />}
                    {icon === "expense" && <div className="h-4 w-4 rounded-full border-2 border-[#01162c]"></div>}
                    {icon === "income" && <div className="h-4 w-4 rounded-full border-2 border-[#01162c]"></div>}
                    {icon === "balance" && <div className="h-4 w-4 rounded-full border-2 border-[#01162c]"></div>}
                </div>
                <span className="text-sm text-[#8f939f]">{title}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
                <span className="text-xl font-bold text-[#01162c]">{amount}</span>
                <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-[#27c661]" : "text-[#f55f5f]"}`}>
                    {isPositive ? (
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
                            className="h-3 w-3"
                        >
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    ) : (
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
                            className="h-3 w-3"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    )}
                    {percentage}
                </div>
            </div>
        </div>
    )
}

