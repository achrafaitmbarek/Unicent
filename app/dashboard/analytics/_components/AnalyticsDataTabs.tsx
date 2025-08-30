"use client"
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TransactionAnalyticsView } from "@/components/shared/analytics/TransactionAnalyticsView";
import { getIncomeTransactions, getSpendingTransactions } from "@/services/actions/transactions";
import { getMonthlyIncomeData, getMonthlyExpenseData } from "@/services/actions/get-bank-data";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/shared/sync-button";
import { categoryColors } from "@/components/shared/category‐colors";
import { Loader2 } from "lucide-react";
import SkeletonAnalytics from "@/components/skeletons/AnalyticsSkeleton";

export const experimental_ppr = true

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



export default function AnalyticsDataTabs() {
    const [activeTab, setActiveTab] = useState("income");
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [monthsToLoad, setMonthsToLoad] = useState(3);

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
    const [refreshCount, setRefreshCount] = useState(0)
    useEffect(() => {
        async function fetchAllData() {
            if (initialLoad) {
                setIsLoading(true);
            }
            try {
                const [
                    incomeResult,
                    expenseResult,
                    monthlyIncomeResult,
                    monthlyExpenseResult
                ] = await Promise.all([
                    getIncomeTransactions(monthsToLoad * 10), // Assume ~10 transactions per month
                    getSpendingTransactions(monthsToLoad * 10),
                    getMonthlyIncomeData(monthsToLoad),
                    getMonthlyExpenseData(monthsToLoad)
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
                setInitialLoad(false);
                setLoadingMore(false);
            }
        }

        fetchAllData();
    }, [refreshCount, monthsToLoad]);

    const triggerRefresh = () => setRefreshCount(c => c + 1)
    const handleLoadMore = async () => {
        setLoadingMore(true);
        // Add 3 more months
        setMonthsToLoad(prev => Math.min(prev + 3, 12)); // Cap at 12 months
    };

    return (
        <div>
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

            {initialLoad && isLoading ? (
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
                            {/* <SyncButton /> */}
                            <TransactionAnalyticsView
                                type="income"
                                transactions={incomeData}
                                monthlyData={monthlyIncomeData}
                                categoryColors={categoryColors}
                                onCategoryUpdated={triggerRefresh}
                            />

                            {monthsToLoad < 12 && ( // Only show if less than max
                                <div className="mt-6 text-center">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        variant="outline"
                                        className="w-64"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Loading more data...
                                            </>
                                        ) : (
                                            `Load More (${monthsToLoad} months shown)`
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <SyncButton />
                            <TransactionAnalyticsView
                                type="expense"
                                transactions={expenseData}
                                monthlyData={monthlyExpenseData}
                                categoryColors={categoryColors}
                                onCategoryUpdated={triggerRefresh}
                            />

                            {monthsToLoad < 12 && ( // Only show if less than max
                                <div className="mt-6 text-center">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        variant="outline"
                                        className="w-64"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Loading more data...
                                            </>
                                        ) : (
                                            `Load More (${monthsToLoad} months shown)`
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
}