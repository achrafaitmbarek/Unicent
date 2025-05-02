"use client"
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TransactionAnalyticsView } from "@/components/shared/analytics/TransactionAnalyticsView";
import { getIncomeTransactions, getSpendingTransactions } from "@/services/actions/transactions";
import { getMonthlyIncomeData, getMonthlyExpenseData } from "@/services/actions/get-bank-data";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/shared/sync-button";

export const experimental_ppr = true

const categoryColors = {
    "SUBSCRIPTION": "#FF5A5F",
    "GROCERIES": "#7AC74F",
    "SHOPPING": "#42BFDD",
    "DINING": "#FFD166",
    "TRANSPORTATION": "#0353A4",
    "UTILITIES": "#7678ED",
    "ENTERTAINMENT": "#D62828",
    "HOUSING": "#9966FF",
    "HEALTHCARE": "#EF476F",
    "EDUCATION": "#4BC0C0",
    "TRAVEL": "#FB8B24",
    "TRANSFER": "#118AB2",
    "OTHER": "#8b5cf6",

    "SALARY": "#23c55e",
    "INVESTING": "#fa7a4b",
    "BUSINESS_INCOME": "#4f46e5",
    "RENTAL_INCOME": "#06D6A0",
    "FREELANCE": "#9966FF",
    "REFUND": "#6366f1",
    "PENSION": "#84cc16",
    "DIVIDEND": "#FF6B6B",
    "GIFT_RECEIVED": "#FF9E7A",
    "INTEREST": "#C4FAF8"
};
type MonthlyDataItem = {
    month: string;
    year: string;
    income?: number;
    expense?: number;
};

type MonthlyDataResponse = {
    data: MonthlyDataItem[];
    currencySymbol: string;
    maxValue: number;
};
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

function SkeletonAnalytics() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm h-64">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-40 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm h-64">
                    <div className="h-64 w-64 bg-gray-200 rounded-full mx-auto"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-6"></div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsLayout() {
    const [activeTab, setActiveTab] = useState("income");
    const [isLoading, setIsLoading] = useState(true);
    const [incomeData, setIncomeData] = useState<Transaction[]>([]);
    const [expenseData, setExpenseData] = useState<Transaction[]>([]);
    const [monthlyIncomeData, setMonthlyIncomeData] = useState<MonthlyDataResponse>({
        data: [],
        currencySymbol: "$",
        maxValue: 0
    });
    const [monthlyExpenseData, setMonthlyExpenseData] = useState<MonthlyDataResponse>({
        data: [],
        currencySymbol: "$",
        maxValue: 0
    });


    useEffect(() => {
        async function fetchAllData() {
            setIsLoading(true);
            try {
                const [
                    incomeResult,
                    expenseResult,
                    monthlyIncomeResult,
                    monthlyExpenseResult
                ] = await Promise.all([
                    getIncomeTransactions(),
                    getSpendingTransactions(),
                    getMonthlyIncomeData(9),
                    getMonthlyExpenseData(9)
                ]);

                setIncomeData((incomeResult.success && incomeResult.transactions
                    ? incomeResult.transactions
                    : []) as Transaction[]);

                setExpenseData((expenseResult.success && expenseResult.transactions
                    ? expenseResult.transactions
                    : []) as Transaction[]);
                setMonthlyIncomeData(monthlyIncomeResult);
                setMonthlyExpenseData(monthlyExpenseResult);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllData();
    }, []);

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold transition-all duration-300">
                    {activeTab === "income" ? "Income Analysis" : "Expense Analysis"}
                </h1>

                <div className="flex relative overflow-hidden rounded-md bg-[#B1C3D7] p-3">
                    <motion.div
                        className="absolute top-1.5 bottom-1.5 rounded-md bg-[#01162c] z-0"
                        animate={{
                            left: activeTab === "income" ? "3px" : "50%",
                            right: activeTab === "income" ? "50%" : "3px",
                        }}
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    <Button
                        className={`relative z-10 mr-6 px-7 py-0 transition-colors duration-200 border-none hover:bg-transparent focus:ring-0 ${activeTab === "income"
                            ? "text-white hover:text-white"
                            : "text-white"
                            }`}
                        onClick={() => setActiveTab("income")}
                        variant="ghost"
                    >
                        Income
                    </Button>

                    <Button
                        className={`relative z-10 px-7 py-0 transition-colors duration-200 border-none hover:bg-transparent focus:ring-0 ${activeTab === "expense"
                            ? "text-white hover:text-white"
                            : "text-white"
                            }`}
                        onClick={() => setActiveTab("expense")}
                        variant="ghost"
                    >
                        Expenses
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <SkeletonAnalytics />
            ) : (
                <motion.div
                    className="will-change-opacity"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                >
                    {activeTab === "income" ? (
                        <>
                            <SyncButton />
                            <TransactionAnalyticsView
                                type="income"
                                transactions={incomeData}
                                monthlyData={monthlyIncomeData}
                                categoryColors={categoryColors}
                            />
                        </>
                    ) : (
                        <>
                            <SyncButton />
                            <TransactionAnalyticsView
                                type="expense"
                                transactions={expenseData}
                                monthlyData={monthlyExpenseData}
                                categoryColors={categoryColors}
                            />
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
}