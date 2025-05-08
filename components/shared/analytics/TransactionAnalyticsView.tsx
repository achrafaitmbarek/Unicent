"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IncomeChart } from "@/components/shared/income-chart"
import { CategoryDonut } from "@/components/shared/CategoryDonut"
import { EditableCategory } from "@/components/shared/EditableCategory"
import { format, } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMemo, useState } from "react"

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
    onCategoryUpdated: () => void;
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
    categoryColors,
    onCategoryUpdated
}: TransactionAnalyticsViewProps) {
    // Extract unique months from transactions
    const availableMonths = useMemo(() => {
        const months = new Set<string>();

        // Add "All" option
        months.add("all|All Months");

        // Add months from transactions
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = format(date, "MMMM yyyy");
            months.add(`${monthKey}|${monthLabel}`);
        });

        return Array.from(months)
            .map(item => {
                const [key, label] = item.split("|");
                return { key, label };
            })
            .sort((a, b) => {
                if (a.key === "all") return -1;
                if (b.key === "all") return 1;
                return b.key.localeCompare(a.key);
            });
    }, [transactions]);

    // State for selected month (default to "all")
    const [selectedMonth, setSelectedMonth] = useState("all");

    // Filter transactions based on selected month
    const filteredTransactions = useMemo(() => {
        if (selectedMonth === "all") {
            return transactions;
        }

        return transactions.filter(tx => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return monthKey === selectedMonth;
        });
    }, [transactions, selectedMonth]);

    // Calculate category data based on filtered transactions
    const {
        categories,
        totalFormatted,
    } = useMemo(() => {
        const categoriesMap = new Map();
        let total = 0;

        // Use filteredTransactions instead of all transactions
        filteredTransactions.forEach(transaction => {
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

        // Rest of the existing category calculation code...
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
    }, [filteredTransactions, monthlyData, type, categoryColors]);

    const title = type === "income" ? "Income" : "Expense";
    const colorClass = type === "income" ? "text-green-600" : "text-red-600";
    // const arrowColor = type === "income" ? "text-green-500" : "text-red-500";

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">{title} Trend</h2>

                        {/* Month selector */}
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px] h-9 text-sm border-[#edf2f6] bg-[#fafcfa] text-[#747682]">
                                <SelectValue placeholder="Filter by month" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMonths.map(month => (
                                    <SelectItem key={month.key} value={month.key}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-64">
                        <IncomeChart
                            data={monthlyData.data}
                            currencySymbol={monthlyData.currencySymbol}
                            type={type}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <CategoryDonut
                        data={categories}
                        centerText={totalFormatted}
                        centerSubtext={`Total ${selectedMonth === "all" ? "" : "Monthly"} ${type}`}
                        title={`${title} Categories ${selectedMonth === "all" ? "" : "- " +
                            availableMonths.find(m => m.key === selectedMonth)?.label}`}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-xl font-medium text-[#01162c]">
                        {title} Transactions
                        {selectedMonth !== "all" && ` - ${availableMonths.find(m => m.key === selectedMonth)?.label}`}
                    </h2>
                    <div className="text-sm text-[#747682]">
                        {filteredTransactions.length} transactions
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {filteredTransactions?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No {type} transactions found for the selected period</div>
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
                                {filteredTransactions?.map((transaction) => {
                                    // Existing transaction row code...
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
                                                    onUpdated={onCategoryUpdated}
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