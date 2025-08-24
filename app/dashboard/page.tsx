// import { auth } from "@/auth";
// import { ProgressSteps } from "@/components/shared/progressSteps";
// import bank1Logo from "@/assets/Societe-Generale-Logo.png";
// import bank2Logo from "@/assets/bnpp.png";
// import bank3Logo from "@/assets/Hello_bankLogo.png";
// import BankCard from "@/components/shared/bank-card";

// const DashboardPage = async () => {
//     const session = await auth();

//     if (!session?.user?.email) {
//         return <h1>Access Denied</h1>;
//     }

//     const steps = [
//         { id: 1, label: "Select Your Bank" },
//         { id: 2, label: "Waiting Auth ..." },
//         { id: 3, label: "Auth Completed" }
//     ]
//     const banks = [
//         { id: 1, name: "Société Générale", logo: bank1Logo },
//         { id: 2, name: "BNP Paribas", logo: bank2Logo },
//         { id: 3, name: "Crédit Agricole", logo: bank3Logo },
//         { id: 4, name: "LCL", logo: bank1Logo },
//         { id: 5, name: "HSBC", logo: bank2Logo },
//         { id: 6, name: "Boursorama", logo: bank3Logo },
//         { id: 7, name: "ING Direct", logo: bank1Logo },
//         { id: 8, name: "Revolut", logo: bank2Logo },
//     ];
//     return (
//         <div className="mx-auto flex flex-col items-center justify-center max-w-7xl p-8 space-y-12">
//             <h1 className="text-2xl font-bold mb-2">
//                 Select Your Bank
//             </h1>
//             <ProgressSteps steps={steps} currentStep={1} />
//             <h1 className="text-2xl font-bold mb-6">
//                 Supported Banks
//             </h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
//                 {banks.map((bank) => (
//                     <BankCard
//                         key={bank.id}
//                         name={bank.name}
//                         logo={bank.logo}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default DashboardPage;



import { getRecentTransactions } from "@/services/actions/transactions";
import { format, isToday, differenceInHours } from "date-fns";
import {
    Plane, Utensils, ArrowDownRight, ArrowUpRight,
    Receipt, TrendingUp, ShoppingBag,
    Car, Zap, Film, Building, Heart, GraduationCap,
    HelpCircle, ShoppingBasket, DollarSign, Briefcase,
    Home, Laptop, RotateCcw, Coins, BarChart3, Gift,
    Percent, ArrowLeftRight
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
import { Card, CardContent } from "@/components/ui/card";

function getTransactionIcon(category: TransactionCategory) {
    const iconMap = {
        "SALARY": { icon: DollarSign, color: "#23c55e", bgColor: "#e9f7ee" },
        "INVESTING": { icon: TrendingUp, color: "#12B76A", bgColor: "#ECFDF3" },
        "BUSINESS_INCOME": { icon: Briefcase, color: "#4f46e5", bgColor: "#eef2ff" },
        "RENTAL_INCOME": { icon: Home, color: "#06D6A0", bgColor: "#e0faf4" },
        "FREELANCE": { icon: Laptop, color: "#9966FF", bgColor: "#f5f0ff" },
        "REFUND": { icon: RotateCcw, color: "#6366f1", bgColor: "#eef2ff" },
        "PENSION": { icon: Coins, color: "#84cc16", bgColor: "#f0fae0" },
        "DIVIDEND": { icon: BarChart3, color: "#FF6B6B", bgColor: "#ffecec" },
        "GIFT_RECEIVED": { icon: Gift, color: "#FF9E7A", bgColor: "#fff1ec" },
        "INTEREST": { icon: Percent, color: "#C4FAF8", bgColor: "#f0fcfb" },

        "SUBSCRIPTION": { icon: Receipt, color: "#7F56D9", bgColor: "#F9F5FF" },
        "GROCERIES": { icon: ShoppingBasket, color: "#F79009", bgColor: "#FFFAEB" },
        "SHOPPING": { icon: ShoppingBag, color: "#F63D68", bgColor: "#FFF1F3" },
        "DINING": { icon: Utensils, color: "#F04438", bgColor: "#FEF3F2" },
        "TRANSPORTATION": { icon: Car, color: "#175CD3", bgColor: "#EFF8FF" },
        "UTILITIES": { icon: Zap, color: "#DC6803", bgColor: "#FFFAEB" },
        "ENTERTAINMENT": { icon: Film, color: "#C11574", bgColor: "#FDF2FA" },
        "HOUSING": { icon: Building, color: "#363F72", bgColor: "#F8F9FC" },
        "HEALTHCARE": { icon: Heart, color: "#B42318", bgColor: "#FEF3F2" },
        "EDUCATION": { icon: GraduationCap, color: "#027A48", bgColor: "#ECFDF3" },

        "TRAVEL": { icon: Plane, color: "#026AA2", bgColor: "#F0F9FF" },
        "TRANSFER": { icon: ArrowLeftRight, color: "#118AB2", bgColor: "#e0f7ff" },
        "OTHER": { icon: HelpCircle, color: "#667085", bgColor: "#F2F4F7" }
    };

    const iconData = iconMap[category] || iconMap.OTHER;
    const Icon = iconData.icon;

    return {
        icon: <Icon className={`h-5 w-5`} style={{ color: iconData.color }} />,
        bgColor: iconData.bgColor
    };
}

const Analytics = async () => {
    const result = await getRecentTransactions(5);
    const transactions = result.success ? result.transactions : [];
    const accountBalance = await getAccountBalance();
    const totalExpenses = await getTotalExpenses();
    const totalIncome = await getTotalIncome();
    const currentMonthSpend = await getCurrentMonthSpend();
    const monthlySpendData = await getMonthlySpendData(4);
    const categoryData = await getCategorySpendData();


    return (
        <div className="container">
            <div>
                <h1 className="text-2xl font-bold text-[#01162c]">Dashboard</h1>
                <p className="text-[#8f939f]">Financial Overview</p>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4">
                <FinancialCard
                    icon="dollar"
                    title={`${currentMonthSpend.monthName} Spend`}
                    amount={`${currentMonthSpend.currencySymbol}${currentMonthSpend.total.toFixed(2)}`}
                    percentage="+4.85%"
                    isPositive={true}
                    borderColor="border-[#1c60e8]"
                    bgColor="bg-[#f3f7ff]"
                    strokeColor="#1c60e8"
                    isBlurred={true}
                />
                <FinancialCard
                    icon="expense"
                    title="Total Expenses"
                    amount={`${totalExpenses.currencySymbol}${totalExpenses.total.toFixed(2)}`}
                    percentage="+3.74%"
                    isPositive={false}
                    borderColor="border-[#fa16d6]"
                    bgColor="bg-[#fff3fd]"
                    strokeColor="#fa16d6"
                    isBlurred={true}
                />
                <FinancialCard
                    icon="income"
                    title="Total Incomes"
                    amount={`${totalIncome.currencySymbol}${totalIncome.total.toFixed(2)}`}
                    percentage="+3.74%"
                    isPositive={true}
                    borderColor="border-[#23c55e]"
                    bgColor="bg-[#f4fcf7]"
                    strokeColor="#23c55e"
                    isBlurred={true}
                />
                <FinancialCard
                    icon="balance"
                    title="Total Balance"
                    amount={`${accountBalance[0].currencySymbol}${accountBalance[0].balance.toFixed(2)}`}
                    percentage="+2.74%"
                    isPositive={true}
                    borderColor="border-[#1c60e8]"
                    bgColor="bg-[#f3f7ff]"
                    strokeColor="#1c60e8"
                    isBlurred={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <MonthlySpendChart
                        data={monthlySpendData.data}
                        currencySymbol={monthlySpendData.currencySymbol}
                    />
                </div>

                <div>
                    <ActivityChart data={categoryData} />
                </div>
            </div>


            <div className="mt-6 grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <Card className="h-full">
                        <CardContent className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#03091d]">Recent Transactions</h3>
                                <SyncButton />
                            </div>

                            <div className="flex-1 overflow-auto">
                                {transactions?.length === 0 ? (
                                    <div className="p-8 h-full flex items-center justify-center text-gray-500">
                                        No recent transactions found
                                    </div>
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
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4">
                    <Card className="h-full">
                        <CardContent className="p-6 h-full flex flex-col">
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="flex justify-center">
                                    <Image src={customerService} alt="Support" width={120} height={120} />
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-[#01162c]">Need Help?</h2>
                                <p className="mt-2 text-sm text-[#8f939f] text-center">
                                    Our customer support team is available 24/7. For any queries, please visit our Support Portal or view our
                                    FAQ
                                </p>
                                <div className="mt-auto w-full pt-6">
                                    <Button className="w-full rounded-md bg-[#01162c] px-4 py-3 text-white hover:bg-opacity-90 transition-colors">
                                        View FAQ
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Analytics;