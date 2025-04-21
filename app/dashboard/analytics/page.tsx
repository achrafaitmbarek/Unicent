import { getRecentTransactions } from "@/services/actions/transactions";
import { format, isToday, differenceInHours } from "date-fns";
import {
    Plane, Utensils, ArrowDownRight, ArrowUpRight,
    ChevronDown, Receipt, TrendingUp, ShoppingBag,
    Car, Zap, Film, Building,
    Heart, GraduationCap, HelpCircle, ShoppingBasket
} from "lucide-react";
import { SyncButton } from "@/components/shared/sync-button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FinancialCard } from "@/components/shared/financial-card"
import { ActivityChart } from "@/components/shared/activity-chart";
import { MonthlySpendChart } from "@/components/shared/monthly-spend-chart";
import Image from "next/image";
import customerService from "@/assets/avatars/CustomersService.png"
import { Button } from "@/components/ui/button";
import { getAccountBalance, getCategorySpendData, getCurrentMonthSpend, getMonthlySpendData, getTotalExpenses, getTotalIncome } from "@/services/actions/get-bank-data";
import { TransactionCategory } from "@prisma/client";

function getTransactionIcon(category: TransactionCategory) {
    const iconMap = {
        SUBSCRIPTION: { icon: Receipt, color: "#7F56D9", bgColor: "#F9F5FF" },
        INVESTING: { icon: TrendingUp, color: "#12B76A", bgColor: "#ECFDF3" },
        GROCERIES: { icon: ShoppingBasket, color: "#F79009", bgColor: "#FFFAEB" },
        SHOPPING: { icon: ShoppingBag, color: "#F63D68", bgColor: "#FFF1F3" },
        DINING: { icon: Utensils, color: "#F04438", bgColor: "#FEF3F2" },
        TRANSPORTATION: { icon: Car, color: "#175CD3", bgColor: "#EFF8FF" },
        UTILITIES: { icon: Zap, color: "#DC6803", bgColor: "#FFFAEB" },
        ENTERTAINMENT: { icon: Film, color: "#C11574", bgColor: "#FDF2FA" },
        HOUSING: { icon: Building, color: "#363F72", bgColor: "#F8F9FC" },
        HEALTHCARE: { icon: Heart, color: "#B42318", bgColor: "#FEF3F2" },
        EDUCATION: { icon: GraduationCap, color: "#027A48", bgColor: "#ECFDF3" },
        TRAVEL: { icon: Plane, color: "#026AA2", bgColor: "#F0F9FF" },
        OTHER: { icon: HelpCircle, color: "#667085", bgColor: "#F2F4F7" }
    };

    const iconData = iconMap[category] || iconMap.OTHER;
    const Icon = iconData.icon;

    return {
        icon: <Icon className={`h-5 w-5`} style={{ color: iconData.color }} />,
        bgColor: iconData.bgColor
    };
}

const Analytics = async () => {
    const result = await getRecentTransactions(6);
    const transactions = result.success ? result.transactions : [];
    const accountBalance = await getAccountBalance();
    const totalExpenses = await getTotalExpenses();
    const totalIncome = await getTotalIncome();
    const currentMonthSpend = await getCurrentMonthSpend();
    const monthlySpendData = await getMonthlySpendData(3);
    const categoryData = await getCategorySpendData();


    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-2xl font-bold text-[#01162c]">Dashboard</h1>
                <p className="text-[#8f939f]">Financial Overview</p>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4">
                <FinancialCard
                    icon="dollar"
                    title={currentMonthSpend.monthName}
                    amount={currentMonthSpend.currencySymbol + currentMonthSpend.total.toFixed(2)}
                    percentage="+4.85%" isPositive={true} />
                <FinancialCard
                    icon="expense"
                    title="Total Expenses"
                    amount={totalExpenses.currencySymbol + totalExpenses.total.toFixed(2)}
                    percentage="+3.74%"
                    isPositive={false}
                />
                <FinancialCard
                    icon="income"
                    title="Total Incomes"
                    amount={totalIncome.currencySymbol + totalIncome.total.toFixed(2)}
                    percentage="+3.74%"
                    isPositive={false}
                />
                <FinancialCard
                    icon="balance"
                    title="Total Balance"
                    amount={accountBalance[0].currencySymbol + accountBalance[0].balance.toFixed(2)}
                    percentage="+2.74%"
                    isPositive={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg bg-white p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#01162c]">Monthly Spend</h2>
                        <Button className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-[#8f939f]">
                            Monthly <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mt-4 h-[240px]">
                        <MonthlySpendChart
                            data={monthlySpendData.data}
                            currencySymbol={monthlySpendData.currencySymbol}
                        />
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#01162c]">Activity</h2>
                        <Button className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-[#8f939f]">
                            Weekly <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                        <ActivityChart data={categoryData} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium text-[#01162c]">Recent Transactions</h3>
                        <SyncButton />
                    </div>

                    <div className="bg-white rounded-lg overflow-hidden">
                        {transactions?.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No recent transactions found</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Description</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions?.map((tx) => {
                                        const txDate = new Date(tx.date);
                                        const isRecent = differenceInHours(new Date(), txDate) < 1;
                                        return (
                                            <TableRow key={tx.pk} className="hover:bg-gray-50 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {(() => {
                                                            const { icon, bgColor } = getTransactionIcon(tx.category);
                                                            return (
                                                                <div
                                                                    className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                                    style={{ backgroundColor: bgColor }}
                                                                >
                                                                    {icon}
                                                                </div>
                                                            );
                                                        })()}
                                                        <span className="font-medium text-gray-800">{tx.wording}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {format(txDate, "d MMMM, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    {isRecent ? (
                                                        <span className="rounded-md px-3 py-1 text-xs bg-[#e9f9ef] text-[#27c661]">
                                                            Now
                                                        </span>
                                                    ) : isToday(txDate) ? (
                                                        <span className="rounded-md px-3 py-1 text-xs bg-[#fff1ed] text-[#ff784b]">
                                                            Today
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-md px-3 py-1 text-xs bg-[#e9f9ef] text-[#27c661]">
                                                            Past
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className={`font-medium flex items-center justify-end ${tx.flow === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.flow === 'INCOME' ? (
                                                            <ArrowDownRight className="h-4 w-4 mr-1" />
                                                        ) : (
                                                            <ArrowUpRight className="h-4 w-4 mr-1" />
                                                        )}
                                                        {tx.account.currencySymbol}{Math.abs(tx.value).toFixed(2)}
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

                <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-6 shadow-sm text-center">
                    <div className="flex justify-center">
                        <Image src={customerService} alt="Support" width={120} height={120} />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-[#01162c]">Need Help?</h2>
                    <p className="mt-2 text-sm text-[#8f939f]">
                        Our customer support team is available 24/7. For any queries, please visit our Support Portal or view our
                        FAQ
                    </p>
                    <Button className="mt-6 w-full rounded-md bg-[#01162c] px-4 py-3 text-white hover:bg-opacity-90 transition-colors">
                        View FAQ
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;