import { ChevronDown, MoreHorizontal, Check, LockKeyhole, ArrowUpRight } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getSpendingOptimizationDisplayData } from "@/services/actions/spending-optimization";
import { PersonalizedTip } from "@/components/shared/personalized-tip";
import { MonthSelector } from "@/components/shared/month-selector";

export default async function SmartBudgetsPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string }>;
}) {
    const params = await searchParams;

    const currentDate = new Date();

    const month = params.month ? parseInt(params.month) :
        (currentDate.getMonth() === 0 ? 12 : currentDate.getMonth());

    const year = params.year ? parseInt(params.year) :
        (currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear());

    const data = await getSpendingOptimizationDisplayData(month, year);

    return (
        <>
            <div className="flex flex-1 flex-col container">

                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-[#01162c]">AI Budget Recommendations</h1>

                    <MonthSelector
                        currentMonth={month}
                        currentYear={year}
                        isPremium={data.isPremium}
                    />
                </div>
                <div className="grid gap-6 md:grid-cols-5">
                    <div className="rounded-lg border border-[#e6ecf2] bg-white p-5 md:col-span-3">
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
                                <p className="mb-1 text-xl font-bold text-[#01162c]">
                                    {data.summary.totalCurrentSpendingFormatted}
                                </p>
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
                                <p className="mb-1 text-xl font-bold text-[#01162c]">
                                    {data.summary.totalRecommendedSpendingFormatted}
                                </p>
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
                                <p className="mb-1 text-xl font-bold text-[#01162c]">
                                    {data.summary.totalPotentialSavingsFormatted}
                                </p>
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
                    <div className="md:col-span-2">
                        <PersonalizedTip recommendations={data.recommendations} />
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
                                {data.recommendations.map((rec, index) => {
                                    const percentDiff = ((rec.potentialSavings / rec.currentSpending) * 100).toFixed(0);
                                    const date = new Date(rec.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    });
                                    let bgColor = "bg-[#f4fcf7]";
                                    let textColor = "text-[#00b158]";
                                    let priorityLabel = "Low Priority";
                                    let showCheckmark = false;

                                    if (rec.priority === "HIGH") {
                                        bgColor = "bg-[#fff1ed]";
                                        textColor = "text-[#fc4b53]";
                                        priorityLabel = "High Priority";
                                        showCheckmark = true;
                                    } else if (rec.priority === "MEDIUM") {
                                        bgColor = "bg-[#fff3fd]";
                                        textColor = "text-[#b2910f]";
                                        priorityLabel = "Medium Priority";
                                    }

                                    const categoryName = rec.categoryLabel || rec.category.toLowerCase().replace(/_/g, ' ');

                                    const isPremiumRow = data.isLimited && index >= 3;

                                    return (
                                        <TableRow
                                            key={rec.id}
                                            className={`border-b border-[#e6ecf2] ${isPremiumRow ? 'relative' : ''}`}
                                        >
                                            {!isPremiumRow && (
                                                <>
                                                    <TableCell className="py-3">
                                                        <div className={`flex h-5 w-5 items-center justify-center rounded border border-[#e6ecf2] ${showCheckmark ? 'bg-[#23c55e] text-white' : ''}`}>
                                                            {showCheckmark && <Check className="h-3 w-3" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-sm font-medium text-[#01162c]">{categoryName}</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c]">{rec.currentSpendingFormatted}</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c]">{rec.recommendedSpendingFormatted}</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c]">{percentDiff}%</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c]">{date}</TableCell>
                                                    <TableCell className="py-3">
                                                        <span className={`rounded-full ${bgColor} px-3 py-1 text-xs font-medium ${textColor}`}>
                                                            {priorityLabel}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            )}

                                            {isPremiumRow && (
                                                <>

                                                    <TableCell className="py-3 relative">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded border border-[#e6ecf2] blur-sm"></div>

                                                        <div className="absolute inset-0 left-0 right-0 z-10 flex items-center justify-center bg-white/30" style={{ width: "1500px" }}>
                                                            <LockKeyhole className="h-10 w-10 text-[#675AE7]" />
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="py-3 text-sm font-medium text-[#01162c] blur-sm">{categoryName}</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c] blur-sm">{rec.currentSpendingFormatted}</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c] blur-sm">{rec.recommendedSpendingFormatted}</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c] blur-sm">{percentDiff}%</TableCell>
                                                    <TableCell className="py-3 text-sm text-[#01162c] blur-sm">{date}</TableCell>
                                                    <TableCell className="py-3">
                                                        <span className={`rounded-full ${bgColor} px-3 py-1 text-xs font-medium ${textColor} blur-sm`}>
                                                            {priorityLabel}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {data.isLimited && (
                            <div className="bg-gradient-to-r from-[#675AE7] to-[#8A7CF7] rounded-lg p-4 mt-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                                            <LockKeyhole className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-base">
                                                Unlock Premium Insights
                                            </h3>
                                            <p className="text-white/80 text-xs">
                                                {data.totalRecommendations - 3} more AI recommendations to help optimize your budget
                                            </p>
                                        </div>
                                    </div>

                                    <Button variant={'default'} className="py-5 px-6 text-sm rounded-lg">
                                        Upgrade
                                        <ArrowUpRight className="h-3.5 w-3.5 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}