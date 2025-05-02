"use client"

import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IncomeChart } from "@/components/shared/income-chart"
import { CategoryDonut } from "@/components/shared/CategoryDonut"
import { EditableCategory } from "@/components/shared/EditableCategory"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMemo } from "react"

type Transaction = {
    pk: string;
    date: string | Date;
    value: number;
    wording: string;
    category?: string;
    account: {
        name: string;
        currencySymbol: string;
        number?: string;
    };
}
type MonthlyData = {
    data: {
        month: string;
        income?: number;
        expense?: number;
        year: string;
    }[];
    currencySymbol: string;
    maxValue: number;
}

type TransactionAnalyticsViewProps = {
    type: "income" | "expense";
    transactions: Transaction[];
    monthlyData: MonthlyData;
    categoryColors: Record<string, string>;
}

function getCategoryFromTransaction(wording: string) {
    const wordingLower = wording.toLowerCase();

    if (wordingLower.includes("salary") || wordingLower.includes("wage") || wordingLower.includes("payroll")) {
        return "Salary";
    } else if (wordingLower.includes("dividend") || wordingLower.includes("interest")) {
        return "Investment";
    } else if (wordingLower.includes("refund") || wordingLower.includes("reimburse")) {
        return "Refund";
    } else if (wordingLower.includes("transfer") || wordingLower.includes("deposit")) {
        return "Transfer";
    } else {
        return "Other Income";
    }
}

export function TransactionAnalyticsView({
    type,
    transactions,
    monthlyData,
    categoryColors
}: TransactionAnalyticsViewProps) {

    const {
        categories,
        totalFormatted,
        currentMonthAmount
    } = useMemo(() => {
        const categoriesMap = new Map();
        let total = 0;

        transactions?.forEach(transaction => {
            const category = transaction.category ||
                (type === "income"
                    ? getCategoryFromTransaction(transaction.wording)
                    : "OTHER");

            const value = Math.abs(transaction.value);
            total += value;

            if (categoriesMap.has(category)) {
                categoriesMap.set(category, categoriesMap.get(category) + value);
            } else {
                categoriesMap.set(category, value);
            }
        });

        const categoryData = Array.from(categoriesMap).map(([name, value]) => ({
            name,
            value,
            color: (categoryColors[name as keyof typeof categoryColors]) ||
                "#" + Math.floor(Math.random() * 16777215).toString(16)
        }));

        categoryData.sort((a, b) => b.value - a.value);

        const symbol = transactions && transactions.length > 0 && transactions[0]?.account?.currencySymbol
            ? transactions[0].account.currencySymbol
            : "$";

        const currentAmount = monthlyData.data.length > 0
            ? monthlyData.data[monthlyData.data.length - 1][type] || 0 // Add fallback for undefined values
            : 0;

        return {
            categories: categoryData,
            totalAmount: total,
            totalFormatted: `${symbol}${total.toFixed(2)}`,
            currencySymbol: symbol,
            currentMonthAmount: currentAmount
        };
    }, [transactions, monthlyData, type, categoryColors]);

    const title = type === "income" ? "Income" : "Expense";
    const colorClass = type === "income" ? "text-green-600" : "text-red-600";
    const arrowColor = type === "income" ? "text-green-500" : "text-red-500";

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">{title} Trend</h2>
                        <Button className="flex items-center text-[#8993a4] text-sm">
                            This month <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                {monthlyData.currencySymbol}
                                {(currentMonthAmount >= 1000
                                    ? (currentMonthAmount / 1000).toFixed(1) + 'k'
                                    : currentMonthAmount.toFixed(2))}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#f2f4fa] text-[#8993a4]">
                                <span className={arrowColor}>↑ 13%</span> VS Last Month
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <IncomeChart
                            data={monthlyData.data}
                            currencySymbol={monthlyData.currencySymbol}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <CategoryDonut
                        data={categories}
                        centerText={totalFormatted}
                        centerSubtext={`Total ${type}`}
                        title={`${title} Categories`}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3">
                <h2 className="text-xl font-medium text-[#01162c] p-6">{title} Transactions</h2>
                <div className="overflow-x-auto">
                    {transactions?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No {type} transactions found</div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-[#f6fafd]">
                                <TableRow>
                                    <TableHead className="font-medium text-[#747682]">Date</TableHead>
                                    <TableHead className="font-medium text-[#747682] w-[40%]">Description</TableHead>
                                    <TableHead className="font-medium text-[#747682]">Category</TableHead>
                                    <TableHead className="font-medium text-[#747682]">Account</TableHead>
                                    <TableHead className="font-medium text-[#747682] text-right">Amount</TableHead>
                                    <TableHead className="font-medium text-[#747682] w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions?.map((transaction) => {
                                    const txDate = new Date(transaction.date);
                                    const accountDisplay = transaction.account.number ?
                                        `...${transaction.account.number.slice(-4)}` :
                                        "Unknown";

                                    return (
                                        <TableRow key={transaction.pk} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">
                                                {format(txDate, "d MMM yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.wording}
                                            </TableCell>
                                            <TableCell>
                                                <EditableCategory
                                                    transactionId={transaction.pk}
                                                    initialCategory={
                                                        transaction.category ||
                                                        (type === "income"
                                                            ? getCategoryFromTransaction(transaction.wording)
                                                            : "OTHER")
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {accountDisplay}
                                            </TableCell>
                                            <TableCell className={`text-right ${colorClass} font-medium`}>
                                                {transaction.account.currencySymbol}{Math.abs(transaction.value).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="relative">
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 rounded-full"
                                                    >
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}