"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, BarChart2, ArrowUpRight } from "lucide-react";
import { PieDonutShadcn } from "@/components/PieDonutShadcn";
import HammerIcon from "@/assets/Hammer.png"
import Image from "next/image";
import { FinancialReportModal } from "@/components/dashboard/financial-report-modal";
import { FinancialReportData, generateFinancialReport, getFinancialReportData, getUnusualTransactions } from "@/services/actions/financial-report";
import { toast } from "sonner";
interface UnusualTransaction {
    id: string;
    activity: string;
    type: string;
    amount: number;
    date: string | Date;
    status: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface UnusualTransactionsData {
    transactions: UnusualTransaction[];
    summary: {
        total: number;
        highRisk?: number;
        mediumRisk?: number;
        lowRisk?: number;
    };
    month?: number;
    year?: number;
}

const FinancialWatch = () => {
    const [selectedMonth, setSelectedMonth] = useState("october");
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [financialData, setFinancialData] = useState<FinancialReportData | undefined>(undefined);
    const [unusualTransactions, setUnusualTransactions] = useState<UnusualTransactionsData | undefined>(undefined);
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Load initial data
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [financialData, unusualData] = await Promise.all([
                    getFinancialReportData(),
                    getUnusualTransactions()
                ]);

                // Use type assertions to tell TypeScript that the data matches expected types
                setFinancialData(financialData as unknown as FinancialReportData);
                setUnusualTransactions(unusualData as unknown as UnusualTransactionsData);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch financial data:", error);
                toast.error("Failed to load financial data");
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // Handle viewing the complete AI financial report
    const handleViewFinancialReport = async () => {
        try {
            setIsGenerating(true);

            // This function will either retrieve an existing report or generate a new one
            const reportData = await generateFinancialReport();
            setFinancialData(reportData);
            setReportModalOpen(true);

            setIsGenerating(false);
        } catch (error) {
            console.error("Failed to generate financial report:", error);
            toast.error("Failed to generate financial report");
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-8">
            {/* Header Section with button in top-right */}
            {/* Header Section with button in top-right */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#01162c]">AI Insights: Your Financial Report</h1>
                    <p className="text-[#8f939f]">Report for {financialData?.monthName || "April"} {financialData?.year || "2024"} • Predictions for {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
                </div>
                <Button
                    className="bg-[#01162c] text-white rounded flex items-center gap-1.5"
                    onClick={handleViewFinancialReport}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <BarChart2 className="h-4 w-4" />
                            View Complete Report
                        </>
                    )}
                </Button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Income Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Income</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {financialData ? formatCurrency(financialData.totalIncome) : "$0"}
                                </h3>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-md">
                                <ArrowUpRight className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Expenses Card */}
                <Card className="bg-gradient-to-br from-red-50 to-white border border-red-100">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-red-600">Total Expenses</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {financialData ? formatCurrency(Math.abs(financialData.totalExpenses)) : "$0"}
                                </h3>
                            </div>
                            <div className="p-2 bg-red-100 rounded-md">
                                <ArrowUpRight className="h-5 w-5 text-red-600 transform rotate-90" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {
                    financialData && (
                        <Card className={`bg-gradient-to-br ${financialData?.savingsRate >= 0 ? 'from-green-50 to-white border-green-100' : 'from-amber-50 to-white border-amber-100'
                            } border`}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className={`text-sm font-medium ${financialData?.savingsRate >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                            Savings Rate
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1">
                                            {financialData ? `${Math.abs(financialData.savingsRate).toFixed(1)}%` : "0%"}
                                            <span className="text-xs ml-1">
                                                {financialData?.savingsRate < 0 ? '(deficit)' : ''}
                                            </span>
                                        </h3>
                                    </div>
                                    <div className={`p-2 ${financialData?.savingsRate >= 0 ? 'bg-green-100' : 'bg-amber-100'} rounded-md`}>
                                        <ArrowUpRight className={`h-5 w-5 ${financialData?.savingsRate >= 0 ? 'text-green-600' : 'text-amber-600 transform rotate-180'
                                            }`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Card for Donut Chart & Categories */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Spending Breakdown</CardTitle>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="october">July 2025</SelectItem>
                                    <SelectItem value="september">June 2025</SelectItem>
                                    <SelectItem value="august">May 2025</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-60">
                                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <PieDonutShadcn
                                        data={financialData?.spendingBreakdown || []}
                                        centerText={financialData ? formatCurrency(Math.abs(financialData.totalExpenses)) : "$0"}
                                        centerLabel="Total"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col gap-3">
                                        {(financialData?.spendingBreakdown || []).map((item, index) => (
                                            <div key={index} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    ></div>
                                                    <span className="text-sm text-gray-700">{item.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{item.percentage}%</span>
                                                    <span className="text-sm text-gray-500">
                                                        {formatCurrency(item.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Insights Card */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle>AI Financial Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-100 rounded-md mt-1">
                                    <Image src={HammerIcon} alt="Hammer Icon" className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        {financialData?.monthName || "April"} Spending Analysis
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {(financialData?.savingsRate ?? 0) < 0
                                            ? `Last month, you spent more than you earned. Consider reviewing your ${financialData?.spendingBreakdown?.[0]?.name || "largest"} expenses to improve your financial health.`
                                            : `Last month, your top spending category was ${financialData?.spendingBreakdown?.[0]?.name || "Housing"} at ${formatCurrency(financialData?.spendingBreakdown?.[0]?.amount || 0)}.`}
                                    </p>
                                </div>
                            </div>

                            {/* Insight 2 */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-blue-100 rounded-md mt-1">
                                    <BarChart2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        {new Date().toLocaleString('default', { month: 'long' })} Predictions
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Based on your recent patterns, this month we predict your expenses will
                                        {financialData?.predictedExpenses && financialData?.totalExpenses
                                            ? financialData.predictedExpenses > financialData.totalExpenses
                                                ? ` increase to ${formatCurrency(financialData.predictedExpenses)}.`
                                                : ` decrease to ${formatCurrency(financialData.predictedExpenses)}.`
                                            : " be similar to last month."}
                                    </p>
                                </div>
                            </div>

                            {/* Insight 3 */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-amber-100 rounded-md mt-1">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Unusual Activity</h4>
                                    <p className="text-sm text-gray-600">
                                        {unusualTransactions?.summary.total
                                            ? `${unusualTransactions.summary.total} unusual transaction${unusualTransactions.summary.total !== 1 ? 's' : ''} detected this month. Review them below.`
                                            : "No unusual transactions detected this month."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={handleViewFinancialReport}
                                disabled={isGenerating}
                            >
                                {isGenerating ? "Generating Report..." : "Generate Full Financial Report"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Unusual Transactions Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle>Unusual Activity Detected</CardTitle>
                        {(unusualTransactions?.summary.total ?? 0) > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
                                    <AlertTriangle size={12} className="mr-1" />
                                    {unusualTransactions?.summary.total} transaction{unusualTransactions?.summary.total !== 1 ? 's' : ''}
                                </div>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-20">
                            <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                    ) : unusualTransactions?.transactions?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No unusual activity detected this month
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {unusualTransactions?.transactions?.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex flex-col sm:flex-row justify-between border-b pb-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${transaction.status === 'HIGH' ? 'bg-red-100' :
                                            transaction.status === 'MEDIUM' ? 'bg-amber-100' : 'bg-blue-100'
                                            }`}>
                                            <AlertTriangle
                                                className={`h-5 w-5 ${transaction.status === 'HIGH' ? 'text-red-600' :
                                                    transaction.status === 'MEDIUM' ? 'text-amber-600' : 'text-blue-600'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium">{transaction.activity}</div>
                                            <div className="text-sm text-gray-500">{transaction.type}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end mt-2 sm:mt-0">
                                        <div className="font-medium">
                                            {formatCurrency(Math.abs(transaction.amount))}
                                        </div>
                                        <div className="text-xs">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </div>

                                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${transaction.status === 'HIGH' ? 'bg-red-100 text-red-700' :
                                            transaction.status === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {transaction.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Financial Report Modal */}
            <FinancialReportModal
                open={reportModalOpen}
                onOpenChange={setReportModalOpen}
                financialData={financialData}
            />
        </div>
    );
};

export default FinancialWatch;