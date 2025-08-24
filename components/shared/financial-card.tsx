'use client'

interface FinancialCardProps {
    icon: "dollar" | "expense" | "income" | "balance";
    title: string;
    amount: string;
    percentage: string;
    isPositive: boolean;
    borderColor: string;
    bgColor: string;
    strokeColor: string;
    isBlurred?: boolean;
}

export function FinancialCard({
    title,
    amount,
    percentage,
    isPositive,
    borderColor,
    bgColor,
    strokeColor,
    isBlurred = false,
}: FinancialCardProps) {
    const borderColorValue = borderColor.replace('border-[', '').replace(']', '');

    return (
        <div className={`rounded-lg ${bgColor} p-4 relative overflow-hidden group cursor-pointer`}>
            <div
                className="absolute top-0 left-0 w-1 h-1/2"
                style={{ backgroundColor: borderColorValue }}
            ></div>

            <h3 className="mb-2 text-sm font-medium text-[#01162c]">{title}</h3>
            <p className={`mb-1 text-xl font-bold text-[#01162c] transition-all duration-300 ${isBlurred ? 'filter blur-sm group-hover:blur-none' : ''
                }`}>
                {amount}
            </p>
            <div
                className={`flex items-center text-xs font-medium ${isPositive ? "text-[#00b158]" : "text-[#f55f5f]"
                    }`}
            >
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
                        className="mr-1 h-3 w-3"
                    >
                        <path d="m5 12 7-7 7 7" />
                        <path d="M12 19V5" />
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
                        className="mr-1 h-3 w-3"
                    >
                        <path d="m5 12 7 7 7-7" />
                        <path d="M12 5v14" />
                    </svg>
                )}
                {percentage}
            </div>
            <div className="mt-2 h-8 w-full">
                <svg viewBox="0 0 100 20" className="h-full w-full">
                    <path
                        d="M0,10 Q10,5 20,8 T40,6 T60,10 T80,8 T100,10"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1.5"
                    />
                </svg>
            </div>
        </div>
    );
}