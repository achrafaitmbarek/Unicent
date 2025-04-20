import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getIncomeTransactions } from "@/services/actions/transactions";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SyncButton } from "@/components/shared/sync-button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { EditableCategory } from "@/components/shared/EditableCategory";
import { IncomeChart } from "@/components/shared/income-chart";
import { ExpenseDonut } from "@/components/shared/expense-donut";
import { getMonthlyIncomeData } from "@/services/actions/get-bank-data";



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

const IncomesPage = async () => {

    const result = await getIncomeTransactions();
    const incomes = result.success ? result.transactions : [];

    const monthlyIncomeData = await getMonthlyIncomeData(9);

    const currentMonthIncome = monthlyIncomeData.data.length > 0
        ? monthlyIncomeData.data[monthlyIncomeData.data.length - 1].income
        : 0;

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Incomes Analysis</h1>

                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <Button
                        className="bg-nav-normal text-white rounded-none px-6"
                        variant="default"
                    >
                        Incomes
                    </Button>
                    <Link href="/dashboard/analytics/expenses">
                        <Button
                            className="bg-white text-gray-700 hover:bg-gray-50 rounded-none px-6"
                            variant="ghost"
                        >
                            Spendings
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Incomes Trend</h2>
                        <Button className="flex items-center text-[#8993a4] text-sm">
                            This month <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                {monthlyIncomeData.currencySymbol}
                                {(currentMonthIncome >= 1000
                                    ? (currentMonthIncome / 1000).toFixed(1) + 'k'
                                    : currentMonthIncome.toFixed(2))}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#f2f4fa] text-[#8993a4]">
                                <span className="text-green-500">↑ 13%</span> VS Last Month
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <IncomeChart
                            data={monthlyIncomeData.data}
                            currencySymbol={monthlyIncomeData.currencySymbol}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Expense Categories</h2>
                        <MoreHorizontal className="h-5 w-5 text-[#8993a4]" />
                    </div>
                    <div className="flex justify-center">
                        <ExpenseDonut />
                    </div>
                    <div className="flex justify-center gap-12 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#23c55e]"></div>
                            <span className="text-sm">Salary</span>
                            <span className="text-sm font-semibold">50%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#fa7a4b]"></div>
                            <span className="text-sm">Investment</span>
                            <span className="text-sm font-semibold">35%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium">Income Transactions</h3>
                    <SyncButton />
                </div>

                <div className="bg-white rounded-lg overflow-hidden">
                    {incomes?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No income transactions found</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[40%]">Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incomes?.map((income) => {
                                    const txDate = new Date(income.date);
                                    const accountDisplay = income.account.number ?
                                        `...${income.account.number.slice(-4)}` :
                                        "Unknown";

                                    return (
                                        <TableRow key={income.pk} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">
                                                {format(txDate, "d MMM yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {income.wording}
                                            </TableCell>
                                            <TableCell>
                                                <EditableCategory
                                                    transactionId={income.pk}
                                                    initialCategory={income.category || getCategoryFromTransaction(income.wording)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {accountDisplay}
                                            </TableCell>
                                            <TableCell className="text-right text-green-600 font-medium">
                                                {income.account.currencySymbol}{Math.abs(income.value).toFixed(2)}
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
};

export default IncomesPage;