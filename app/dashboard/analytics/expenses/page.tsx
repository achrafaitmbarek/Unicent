import { ChevronDown, MoreHorizontal } from "lucide-react"
import { IncomeChart } from "@/components/shared/income-chart"
import { ExpenseDonut } from "@/components/shared/expense-donut"
import { getSpendingTransactions } from "@/services/actions/transactions";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EditableCategory } from "@/components/shared/EditableCategory";
import { getMonthlyExpenseData } from "@/services/actions/get-bank-data";
import Link from "next/link";




export default async function SpendingsPage() {
    const result = await getSpendingTransactions();
    const expenses = result.success ? result.transactions : [];
    const monthlyExpenseData = await getMonthlyExpenseData(9);

    const currentMonthExpense = monthlyExpenseData.data.length > 0
        ? monthlyExpenseData.data[monthlyExpenseData.data.length - 1].expense
        : 0;
    return (

        <div className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold"> Expense Analysis</h1>

                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <Button
                        className="bg-nav-normal text-white rounded-none px-6"
                        variant="default"
                    >
                        Spendings
                    </Button>
                    <Link href="/dashboard/analytics/incomes">
                        <Button
                            className="bg-white text-gray-700 hover:bg-gray-50 rounded-none px-6"
                            variant="ghost"
                        >

                            Expenses
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Expense Trend</h2>
                        <Button className="flex items-center text-[#8993a4] text-sm">
                            This month <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                {monthlyExpenseData.currencySymbol}
                                {(currentMonthExpense >= 1000
                                    ? (currentMonthExpense / 1000).toFixed(1) + 'k'
                                    : currentMonthExpense.toFixed(2))}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#f2f4fa] text-[#8993a4]">
                                <span className="text-red-500">↑ 13%</span> VS Last Month
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <IncomeChart
                            data={monthlyExpenseData.data}
                            currencySymbol={monthlyExpenseData.currencySymbol}
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

            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <div className="bg-white rounded-lg overflow-hidden">
                    {expenses?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No spending transactions found</div>
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
                                {expenses?.map((expense) => {
                                    const txDate = new Date(expense.date);
                                    const accountDisplay = expense.account.number ?
                                        `...${expense.account.number.slice(-4)}` :
                                        "Unknown";

                                    return (
                                        <TableRow key={expense.pk} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">
                                                {format(txDate, "d MMM yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {expense.wording}
                                            </TableCell>
                                            <TableCell>
                                                <EditableCategory
                                                    transactionId={expense.pk}
                                                    initialCategory={expense.category || "OTHER"}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {accountDisplay}
                                            </TableCell>
                                            <TableCell className="text-right text-red-600 font-medium">
                                                {expense.account.currencySymbol}{Math.abs(expense.value).toFixed(2)}
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
    )
}

