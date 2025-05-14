"use client";
import { Download, ShoppingBag, Coffee, Lightbulb } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FinancialCard } from "@/components/shared/financial-card";
import { PieDonutShadcn } from "@/components/PieDonutShadcn";

const spendingCategories = [
    { name: "Housing", amount: 1250, percentage: 35, color: "#3b82f6", value: 35 },
    { name: "Food & Dining", amount: 650, percentage: 18, color: "#10b981", value: 18 },
    { name: "Transportation", amount: 450, percentage: 13, color: "#f59e0b", value: 13 },
    { name: "Shopping", amount: 400, percentage: 11, color: "#8b5cf6", value: 11 },
    { name: "Entertainment", amount: 350, percentage: 10, color: "#ec4899", value: 10 },
    { name: "Others", amount: 470, percentage: 13, color: "#6b7280", value: 13 },
];
interface FinancialReportData {
    id: string;
    title: string;
    month: number;
    year: number;
    monthName: string;
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
    spendingBreakdown: Array<{
        name: string;
        amount: number;
        percentage: number;
        color: string;
        value: number;
    }>;
    predictedIncome: number;
    predictedExpenses: number;
    predicetedCashFlow: number;
    savingsTips: {
        id: string;
        title: string;
        description: string;
        context: string | null;
        reportId: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

interface FinancialReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    financialData?: FinancialReportData;
}

export function FinancialReportModal({ open, onOpenChange, financialData }: FinancialReportModalProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };
    const income = financialData ? formatCurrency(financialData.totalIncome) : "$8,240.00";
    const expenses = financialData
        ? formatCurrency(Math.abs(financialData.totalExpenses)) // Always positive display
        : "$5,670.00";
    const savingsRate = financialData ? formatPercentage(financialData.savingsRate) : "31.2%";
    // const reportMonth = financialData ? financialData.monthName : "October";
    // const reportYear = financialData ? financialData.year : 2024;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl bg-white p-0">
                {/* Header with close button already included by default */}

                {/* Report header section */}
                <div className="p-6 relative border-b">
                    {/* Download button - top left */}
                    <Button
                        variant="default"
                        size="sm"
                        className="absolute top-2 left-6 flex items-center gap-1"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </Button>

                    {/* Center title section */}
                    <div className="text-center pt-8">
                        <h2 className="text-2xl font-semibold text-[#01254b] mb-2">
                            AI Financial Intelligence Report - {financialData?.monthName || "April"} {financialData?.year || "2024"}
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Analysis of your past spending with predictions for the current month.
                        </p>
                    </div>
                </div>

                {/* Report content section */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Income Card */}
                        <FinancialCard
                            icon="income"
                            title="Total Income"
                            amount={income}
                            percentage="12% from last month"
                            isPositive={true}
                            borderColor="border-[#00b158]"
                            bgColor="bg-[#f3f7ff]"
                            strokeColor="#00b15833"
                        />

                        {/* Expense Card */}
                        <FinancialCard
                            icon="expense"
                            title="Total Expenses"
                            amount={expenses}
                            percentage="4% from last month"
                            isPositive={false}
                            borderColor="border-[#f55f5f]"
                            bgColor="bg-[#fff3fd]"
                            strokeColor="#f55f5f33"
                        />

                        {/* Savings Rate Card */}
                        <FinancialCard
                            icon="balance"
                            title="Total Savings Rate"
                            amount={savingsRate}
                            percentage={financialData && financialData.savingsRate < 0
                                ? "Expenses exceeded income"
                                : "8% from last month"}
                            isPositive={financialData ? financialData.savingsRate >= 0 : true}
                            borderColor={financialData && financialData.savingsRate < 0
                                ? "border-[#f55f5f]"
                                : "border-[#0066ff]"}
                            bgColor={financialData && financialData.savingsRate < 0
                                ? "bg-[#fff3fd]"
                                : "bg-[#f4fcf7]"}
                            strokeColor={financialData && financialData.savingsRate < 0
                                ? "#f55f5f33"
                                : "#0066ff33"}
                        />
                    </div>

                    {/* Where Your Money Went Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-[#01254b] mb-4">
                            Where Your Money Went in {financialData?.monthName || "April"}
                        </h3>

                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                            {/* Wrap donut and categories in a flex container */}
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <PieDonutShadcn
                                        data={financialData?.spendingBreakdown || spendingCategories.map(cat => ({
                                            name: cat.name,
                                            value: cat.percentage,
                                            color: cat.color
                                        }))}
                                        centerText={financialData ? formatCurrency(Math.abs(financialData.totalExpenses)) : "$5,670"}
                                        centerLabel="Total"
                                    />
                                </div>

                                <div className="flex-1">
                                    {/* Categories List */}
                                    <div className="flex flex-col gap-3">
                                        {(financialData?.spendingBreakdown || spendingCategories).map((item, index) => (
                                            <div key={index} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    ></div>
                                                    <span className="text-sm text-gray-700">{item.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{item.percentage || item.value}%</span>
                                                    <span className="text-sm text-gray-500">
                                                        {formatCurrency(item.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-[#01254b] mb-4">
                            Predicted Income and Expenses for {
                                financialData ?
                                    new Date().getMonth() + 1 === financialData.month ?
                                        "This Month" :
                                        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleString('default', { month: 'long' })
                                    : "May"} {financialData?.year || "2024"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Predicted Income Card */}
                            <FinancialCard
                                icon="income"
                                title="Predicted Income"
                                amount={financialData?.predictedIncome ? formatCurrency(financialData.predictedIncome) : "$8,520.00"}
                                percentage={financialData?.totalIncome && financialData?.predictedIncome
                                    ? `${((financialData.predictedIncome - financialData.totalIncome) / financialData.totalIncome * 100).toFixed(1)}% ${financialData.predictedIncome > financialData.totalIncome ? "increase" : "decrease"}`
                                    : "3.4% increase"}
                                isPositive={financialData ? financialData.predictedIncome > financialData.totalIncome : true}
                                borderColor="border-[#00b158]"
                                bgColor="bg-[#f3f7ff]"
                                strokeColor="#00b15833"
                            />

                            <FinancialCard
                                icon="expense"
                                title="Predicted Expenses"
                                amount={financialData?.predictedExpenses ? formatCurrency(financialData.predictedExpenses) : "$5,430.00"}
                                percentage={financialData?.totalExpenses && financialData?.predictedExpenses
                                    ? `${Math.abs((financialData.predictedExpenses - financialData.totalExpenses) / financialData.totalExpenses * 100).toFixed(1)}% ${financialData.predictedExpenses < financialData.totalExpenses ? "decrease" : "increase"}`
                                    : "4.2% decrease"}
                                isPositive={financialData ? financialData.predictedExpenses < financialData.totalExpenses : true}
                                borderColor="border-[#f55f5f]"
                                bgColor="bg-[#fff3fd]"
                                strokeColor="#f55f5f33"
                            />

                            {/* Predicted Cash Flow Card */}
                            <FinancialCard
                                icon="balance"
                                title="Predicted Cash Flow"
                                amount={financialData?.predicetedCashFlow ? formatCurrency(financialData.predicetedCashFlow) : "$3,090.00"}
                                percentage=""
                                isPositive={financialData ? financialData.predicetedCashFlow > 0 : true}
                                borderColor="border-[#0066ff]"
                                bgColor="bg-[#f4fcf7]"
                                strokeColor="#0066ff33"
                            />
                        </div>
                    </div>

                    {/* Cost-Saving Tips Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-[#01254b] mb-6 flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                                <Lightbulb className="h-4 w-4 text-white" />
                            </div>
                            Cost-Saving Tips
                        </h3>

                        <div className="relative">
                            {/* Decorative background element */}
                            <div className="absolute -top-8 -right-8 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl -z-10" />
                            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-to-br from-amber-500/10 to-red-500/5 rounded-full blur-3xl -z-10" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {financialData?.savingsTips ? (
                                    financialData.savingsTips.map((tip, index) => {
                                        // Parse context string if it exists (format: "label|current|target")
                                        const contextParts = tip.context?.split('|') || [];
                                        const contextLabel = contextParts[0] || '';
                                        const currentAmount = contextParts[1] || '';
                                        const targetAmount = contextParts[2] || '';

                                        // Determine which icon and colors to use based on tip type or index
                                        const iconColors = [
                                            { icon: ShoppingBag, bgFrom: 'from-blue-500', bgTo: 'to-blue-700', bgLight: 'bg-blue-50', textDark: 'text-blue-900', textLight: 'text-blue-800', divider: 'bg-blue-200' },
                                            { icon: Coffee, bgFrom: 'from-amber-500', bgTo: 'to-amber-700', bgLight: 'bg-amber-50', textDark: 'text-amber-900', textLight: 'text-amber-800', divider: 'bg-amber-200' },
                                            { icon: Lightbulb, bgFrom: 'from-purple-500', bgTo: 'to-purple-700', bgLight: 'bg-purple-50', textDark: 'text-purple-900', textLight: 'text-purple-800', divider: 'bg-purple-200' },
                                        ];

                                        const tipStyle = iconColors[index % iconColors.length];
                                        const Icon = tipStyle.icon;

                                        // Calculate savings percentage if both amounts are available
                                        let savingsPercent = '';
                                        if (currentAmount && targetAmount) {
                                            const current = parseFloat(currentAmount.replace(/[^0-9.]/g, ''));
                                            const target = parseFloat(targetAmount.replace(/[^0-9.]/g, ''));
                                            if (!isNaN(current) && !isNaN(target) && current > 0) {
                                                savingsPercent = `${Math.round((current - target) / current * 100)}%`;
                                            }
                                        }

                                        return (
                                            <div key={tip.id} className="relative group">
                                                <div className={`absolute inset-0 bg-gradient-to-r ${tipStyle.bgFrom}/20 ${tipStyle.bgTo}/20 rounded-xl blur-sm transform group-hover:scale-105 transition-all duration-300`}></div>
                                                <div className="backdrop-blur-sm bg-white/80 rounded-xl border border-white/20 shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                                                    <div className="flex justify-center mb-6">
                                                        <div className={`bg-gradient-to-br ${tipStyle.bgFrom} ${tipStyle.bgTo} p-3 rounded-xl shadow-md`}>
                                                            <Icon className="h-6 w-6 text-white" />
                                                        </div>
                                                    </div>

                                                    <h4 className="font-bold text-[#01254b] text-center text-lg mb-1">{tip.title}</h4>
                                                    <p className="text-xs text-center text-gray-500 mb-4">{contextLabel}</p>

                                                    {contextParts.length >= 3 && (
                                                        <div className={`flex justify-between items-center mb-4 ${tipStyle.bgLight} rounded-lg p-3`}>
                                                            <div>
                                                                <span className={`text-xs font-medium ${tipStyle.textDark}`}>CURRENT</span>
                                                                <div className={`text-lg font-bold ${tipStyle.textLight}`}>{currentAmount}</div>
                                                            </div>

                                                            <div className={`h-8 w-px ${tipStyle.divider}`}></div>

                                                            <div className="text-right">
                                                                <span className="text-xs font-medium text-green-700">TARGET</span>
                                                                <div className="text-lg font-bold text-green-600">{targetAmount}</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <p className="text-sm text-gray-700 border-t border-gray-100 pt-4">
                                                        {tip.description}
                                                        {savingsPercent && (
                                                            <span className="block mt-2 text-blue-600 font-medium">
                                                                Save up to {savingsPercent}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    // Fallback to static tips if no data
                                    <>
                                        {/* Tip 1: Shopping */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm transform group-hover:scale-105 transition-all duration-300"></div>
                                            <div className="backdrop-blur-sm bg-white/80 rounded-xl border border-white/20 shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-xl">
                                                <div className="flex justify-center mb-6">
                                                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-md">
                                                        <ShoppingBag className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>

                                                <h4 className="font-bold text-[#01254b] text-center text-lg mb-1">Shopping</h4>
                                                <p className="text-xs text-center text-gray-500 mb-4">Online purchases</p>

                                                <div className="flex justify-between items-center mb-4 bg-blue-50 rounded-lg p-3">
                                                    <div>
                                                        <span className="text-xs font-medium text-blue-900">CURRENT</span>
                                                        <div className="text-lg font-bold text-blue-800">$320</div>
                                                    </div>

                                                    <div className="h-8 w-px bg-blue-200"></div>

                                                    <div className="text-right">
                                                        <span className="text-xs font-medium text-green-700">TARGET</span>
                                                        <div className="text-lg font-bold text-green-600">$250</div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-700 border-t border-gray-100 pt-4">
                                                    Consider using price comparison tools and waiting for sales to purchase non-essential items.
                                                    <span className="block mt-2 text-blue-600 font-medium">Save up to 20%</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tip 2: Coffee */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl blur-sm transform group-hover:scale-105 transition-all duration-300"></div>
                                            <div className="backdrop-blur-sm bg-white/80 rounded-xl border border-white/20 shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-amber-500/20 hover:shadow-xl">
                                                <div className="flex justify-center mb-6">
                                                    <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-3 rounded-xl shadow-md">
                                                        <Coffee className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>

                                                <h4 className="font-bold text-[#01254b] text-center text-lg mb-1">Dining</h4>
                                                <p className="text-xs text-center text-gray-500 mb-4">Coffee & takeout</p>

                                                <div className="flex justify-between items-center mb-4 bg-amber-50 rounded-lg p-3">
                                                    <div>
                                                        <span className="text-xs font-medium text-amber-900">CURRENT</span>
                                                        <div className="text-lg font-bold text-amber-800">$150</div>
                                                    </div>

                                                    <div className="h-8 w-px bg-amber-200"></div>

                                                    <div className="text-right">
                                                        <span className="text-xs font-medium text-green-700">TARGET</span>
                                                        <div className="text-lg font-bold text-green-600">$80</div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-700 border-t border-gray-100 pt-4">
                                                    Making coffee at home instead of buying takeout coffee can save you around $70/month.
                                                    <span className="block mt-2 text-amber-600 font-medium">Save up to 47%</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tip 3: Utilities */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl blur-sm transform group-hover:scale-105 transition-all duration-300"></div>
                                            <div className="backdrop-blur-sm bg-white/80 rounded-xl border border-white/20 shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-xl">
                                                <div className="flex justify-center mb-6">
                                                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl shadow-md">
                                                        <Lightbulb className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>

                                                <h4 className="font-bold text-[#01254b] text-center text-lg mb-1">Utilities</h4>
                                                <p className="text-xs text-center text-gray-500 mb-4">Energy savings</p>

                                                <div className="flex justify-between items-center mb-4 bg-purple-50 rounded-lg p-3">
                                                    <div>
                                                        <span className="text-xs font-medium text-purple-900">CURRENT</span>
                                                        <div className="text-lg font-bold text-purple-800">$210</div>
                                                    </div>

                                                    <div className="h-8 w-px bg-purple-200"></div>

                                                    <div className="text-right">
                                                        <span className="text-xs font-medium text-green-700">TARGET</span>
                                                        <div className="text-lg font-bold text-green-600">$175</div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-700 border-t border-gray-100 pt-4">
                                                    Switch to LED bulbs and install a programmable thermostat to reduce energy costs.
                                                    <span className="block mt-2 text-purple-600 font-medium">Save up to 17%</span>
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t">
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}