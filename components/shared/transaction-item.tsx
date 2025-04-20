interface TransactionItemProps {
    icon: "rent" | "paypal" | "google" | "salary" | "fiverr"
    title: string
    date: string
    status: "Now" | "Today"
    amount: string
}

export function TransactionItem({ icon, title, date, status, amount }: TransactionItemProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${icon === "paypal" || icon === "salary" ? "bg-[#fff1ed]" : "bg-[#e9f9ef]"
                        }`}
                >
                    <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${icon === "paypal" || icon === "salary" ? "bg-[#ff784b]" : "bg-[#27c661]"
                            }`}
                    >
                        {/* Icon placeholder */}
                    </div>
                </div>
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-xs text-[#8f939f]">{date}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span
                    className={`rounded-md px-3 py-1 text-xs ${status === "Now" ? "bg-[#e9f9ef] text-[#27c661]" : "bg-[#fff1ed] text-[#ff784b]"
                        }`}
                >
                    {status}
                </span>
                <span className="font-medium">{amount}</span>
            </div>
        </div>
    )
}

