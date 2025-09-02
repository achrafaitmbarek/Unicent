'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Transaction, TransactionCategory, TransactionFlow } from "@prisma/client"
import { generateFinancialPredictions } from "./financial-predictions"
import { detectAnomalies } from "@/lib/detectAnomalousTransactions"
import Anthropic from "@anthropic-ai/sdk"

// Add color mapping for transaction categories
const categoryColors: Record<TransactionCategory, string> = {
  HOUSING: "#3b82f6",      // blue
  GROCERIES: "#10b981",    // green
  TRANSPORTATION: "#f59e0b", // amber
  SHOPPING: "#8b5cf6",     // purple
  ENTERTAINMENT: "#ec4899", // pink
  UTILITIES: "#64748b",    // slate
  HEALTHCARE: "#0ea5e9",   // sky
  DINING: "#ef4444",       // red
  EDUCATION: "#14b8a6",    // teal
  SUBSCRIPTION: "#a855f7", // violet
  SALARY: "#059669",       // emerald
  INVESTING: "#0891b2",    // cyan
  BUSINESS_INCOME: "#0d9488", // teal
  RENTAL_INCOME: "#4f46e5", // indigo
  FREELANCE: "#7c3aed",    // violet
  REFUND: "#84cc16",       // lime
  PENSION: "#475569",      // slate
  DIVIDEND: "#047857",     // emerald
  GIFT_RECEIVED: "#c026d3", // fuchsia
  INTEREST: "#0284c7",     // sky
  TRAVEL: "#f97316",       // orange
  TRANSFER: "#6b7280",     // gray
  OTHER: "#94a3b8",        // slate
};
export type FinancialReportData = {
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
  };

  interface SpendingCategory {
    name: string;
    amount: number;
    percentage: number;
    color: string;
    value: number;
  }
/**
 * Gets spending breakdown by category for a specific month
 */
export async function getSpendingByCategory(month?: number, year?: number) {
  // Get authenticated user
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If month/year not provided, use previous month
  const today = new Date();
  
  if (!month || !year) {
    // Get previous month
    if (today.getMonth() === 0) { // January
      month = 12;
      year = today.getFullYear() - 1;
    } else {
      month = today.getMonth(); // 0-indexed, so current month - 1 is previous month
      year = today.getFullYear();
    }
  }

  // Get first and last day of the month
  const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date
  const endDate = new Date(year, month, 0); // Last day of month
  
  // First, find all bank connections for this user
  const bankConnections = await prisma.bankConnection.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });
  
  const connectionIds = bankConnections.map(connection => connection.id);
  
  // Then, find all bank accounts for these connections
  const bankAccounts = await prisma.bankAccount.findMany({
    where: {
      connectionId: {
        in: connectionIds,
      },
    },
    select: {
      pk: true,
    },
  });
  
  const accountPks = bankAccounts.map(account => account.pk);
  
  // Get expense transactions for the month
  const transactions = await prisma.transaction.findMany({
    where: {
      accountId: {
        in: accountPks,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      flow: TransactionFlow.EXPENSE // Only expenses
    },
  });

  // Group by category and calculate totals
  const categoryMap = new Map<TransactionCategory, number>();
  let totalExpenses = 0;
  
  for (const transaction of transactions) {
    const category = transaction.category;
    const amount = Math.abs(transaction.value);
    
    totalExpenses += amount;
    
    const currentAmount = categoryMap.get(category) || 0;
    categoryMap.set(category, currentAmount + amount);
  }
  
  // Convert to array and calculate percentages
  const result = Array.from(categoryMap.entries()).map(([category, amount]) => {
    const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
    
    return {
      name: formatCategoryName(category),
      amount,
      percentage,
      color: categoryColors[category],
      value: percentage // Adding for compatibility with PieDonutShadcn
    };
  });
  
  // Sort by amount (descending)
  result.sort((a, b) => b.amount - a.amount);
  
  // If we have too many categories, combine smaller ones into "Others"
  if (result.length > 6) {
    const mainCategories = result.slice(0, 5);
    const otherCategories = result.slice(5);
    
    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const otherPercentage = totalExpenses > 0 ? Math.round((otherTotal / totalExpenses) * 100) : 0;
    
    mainCategories.push({
      name: "Others",
      amount: otherTotal,
      percentage: otherPercentage,
      color: "#94a3b8", // slate
      value: otherPercentage
    });
    
    return mainCategories;
  }
  
  return result;
}

// Helper function to format category names
function formatCategoryName(category: TransactionCategory): string {
  // Convert SNAKE_CASE to Title Case
  return category.toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('And', '&');
}

// Add this to your existing getMonthlyFinancialSummary function
export async function getFinancialReportData(month?: number, year?: number) {
  try {
    // Get basic financial summary
    const summary = await getMonthlyFinancialSummary(month, year);
    
    // Get spending breakdown by category
    const spendingBreakdown = await getSpendingByCategory(month, year);
    
    return {
      ...summary,
      spendingBreakdown,
    };
  } catch (error) {
    console.error("Error getting financial report data:", error);
    throw error;
  }
}
export async function getMonthlyFinancialSummary(month?: number, year?: number) {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }
  
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    // If month/year not provided, use previous month
    const today = new Date();
    
    if (!month || !year) {
      // Get previous month
      if (today.getMonth() === 0) { // January
        month = 12;
        year = today.getFullYear() - 1;
      } else {
        month = today.getMonth(); // 0-indexed, so current month - 1 is previous month
        year = today.getFullYear();
      }
    }
  
    // Get first and last day of the month
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date
    const endDate = new Date(year, month, 0); // Last day of month
    
    // First, find all bank connections for this user
    const bankConnections = await prisma.bankConnection.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    
    const connectionIds = bankConnections.map(connection => connection.id);
    
    // Then, find all bank accounts for these connections
    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        connectionId: {
          in: connectionIds,
        },
      },
      select: {
        pk: true,
      },
    });
    
    const accountPks = bankAccounts.map(account => account.pk);
    
    // Finally, get transactions for these accounts
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: {
          in: accountPks,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  
    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
  
    for (const transaction of transactions) {
        if (transaction.flow === TransactionFlow.INCOME) {
          totalIncome += transaction.value;
        } else if (transaction.flow === TransactionFlow.EXPENSE) {
          // Store expenses as positive for calculations
          totalExpenses += Math.abs(transaction.value);
        }
      }
      
      
  
    // Calculate savings rate
    // Calculate savings rate
    const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome) * 100 
    : -100;
    // Get month name
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[month - 1];
  
    return {
      totalIncome,
      totalExpenses,
      savingsRate,
      month,
      year,
      monthName,
    };
  }


  

export async function getUnusualTransactions(month?: number, year?: number) {
  // Get authenticated user
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If month/year not provided, use current month
  const today = new Date();
  
  if (!month || !year) {
    month = today.getMonth() + 1; // Current month (1-indexed)
    year = today.getFullYear();
  }

  // Get first and last day of the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  // Get bank connections for this user
  const bankConnections = await prisma.bankConnection.findMany({
    where: { userId: user.id },
    select: { id: true },
  });
  
  const connectionIds = bankConnections.map(connection => connection.id);
  
  // Get bank accounts for these connections
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { connectionId: { in: connectionIds } },
    select: { pk: true },
  });
  
  const accountPks = bankAccounts.map(account => account.pk);
  
  // Get unusual transactions for these accounts
  let unusualTransactions = await prisma.transaction.findMany({
    where: {
      accountId: { in: accountPks },
      date: {
        gte: startDate,
        lte: endDate,
      },
      isUnusual: true,
    },
    orderBy: {
      date: 'desc', // Most recent first
    },
  });

  // Fallback: if none flagged yet, run AI detection once for this period and user, then re-query
  if (unusualTransactions.length === 0) {
    try {
      const candidateTxs = await prisma.transaction.findMany({
        where: {
          accountId: { in: accountPks },
          date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: 'desc' },
        take: 150,
      });

      if (candidateTxs.length > 0) {
  const anomalies = await detectAnomalies(candidateTxs as Transaction[]);
        if (Array.isArray(anomalies) && anomalies.length > 0) {
          for (const a of anomalies) {
            try {
              await prisma.transaction.update({
                where: { pk: a.id },
                data: {
                  isUnusual: a.isUnusual ?? true,
                  riskLevel: a.riskLevel ?? 'MEDIUM',
                  anomalyReason: a.reason ?? 'Identified as unusual by AI analysis',
                  recommendedAmount: a.recommendedAmount ?? null,
                },
              });
            } catch (e) {
              console.error('Failed to update transaction anomaly', a.id, e);
            }
          }
          // Re-query after updates
          unusualTransactions = await prisma.transaction.findMany({
            where: {
              accountId: { in: accountPks },
              date: { gte: startDate, lte: endDate },
              isUnusual: true,
            },
            orderBy: { date: 'desc' },
          });
        }
      }
    } catch (err) {
      console.error('AI anomaly detection fallback failed:', err);
    }
  }

  // Format the transaction data
  const formattedTransactions = unusualTransactions.map(transaction => {
    return {
      id: transaction.pk,
      activity: transaction.wording,
      type: formatCategoryName(transaction.category),
      amount: transaction.value,
      date: transaction.date,
      status: transaction.riskLevel || 'UNKNOWN',
      description: transaction.anomalyReason || 'Unusual spending pattern detected',
      recommendedAmount: transaction.recommendedAmount,
      category: transaction.category
    };
  });

  // Group by risk level for summary
  const summary = {
    total: formattedTransactions.length,
    high: formattedTransactions.filter(t => t.status === 'HIGH').length,
    medium: formattedTransactions.filter(t => t.status === 'MEDIUM').length,
    low: formattedTransactions.filter(t => t.status === 'LOW').length,
  };

  return {
    transactions: formattedTransactions,
    summary,
    month,
    year
  };
}

// List all stored financial reports for the authenticated user
export async function listUserFinancialReports(): Promise<FinancialReportData[]> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) throw new Error("User not found");

  const reports = await prisma.financialReport.findMany({
    where: { userId: user.id },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { savingsTips: true },
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const shaped: FinancialReportData[] = [];
  for (const r of reports) {
    // Attempt to use stored spendingBreakdown; if missing or invalid, compute fallback
    let spending: SpendingCategory[] | null = null;
    if (r.spendingBreakdown && typeof r.spendingBreakdown === 'object') {
      try {
        const val = r.spendingBreakdown as unknown as SpendingCategory[];
        if (Array.isArray(val)) spending = val as SpendingCategory[];
      } catch {
        // ignore and fallback
      }
    }
    if (!spending) {
      try {
        spending = await getSpendingByCategory(r.month, r.year);
      } catch {
        spending = [];
      }
    }

    shaped.push({
      id: r.id,
      title: r.title,
      month: r.month,
      year: r.year,
      monthName: monthNames[r.month - 1] || `${r.month}`,
      totalIncome: r.totalIncome,
      totalExpenses: r.totalExpenses,
      savingsRate: r.savingsRate,
  spendingBreakdown: spending as SpendingCategory[],
      predictedIncome: r.predictedIncome,
      predictedExpenses: r.predictedExpenses,
      predicetedCashFlow: r.predicetedCashFlow,
      savingsTips: r.savingsTips,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })
  }

  return shaped;
}
// Add after the getUnusualTransactions function

/**
 * Generate personalized saving tips based on user's spending patterns
 */
async function generateSavingTips(spendingBreakdown: SpendingCategory[], totalIncome: number, totalExpenses: number) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Create prompt for saving tips
    const prompt = `Based on the following financial data, generate 3 personalized saving tips:

Spending Breakdown:
${spendingBreakdown.map(category => `- ${category.name}: ${category.amount.toFixed(2)} (${category.percentage}% of total)`).join('\n')}

Total Income: ${totalIncome}
Total Expenses: ${totalExpenses}
Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(2) : 0}%

For each tip, I need:
1. A category title (e.g. "Shopping", "Dining", "Utilities")
2. A specific actionable recommendation
3. Context showing current spending and target amount in format "Category|$current|$target"

Please format your response exactly as follows for each tip:

TIP_TITLE: [category]
TIP_DESCRIPTION: [specific recommendation with actionable advice]
TIP_CONTEXT: [category name]|$[current amount]|$[target amount]

Provide 3 tips that are realistic, specific, and would lead to the most impactful savings.`;

    console.log("Generating saving tips with prompt:", prompt);
    
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.5,
      system: "You are a financial advisor providing specific, actionable saving tips based on spending patterns.",
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    if (!('text' in response.content[0])) {
      return getDefaultSavingTips();
    }

    const tipsText = response.content[0].text;
    
    // Parse tips
    const tipRegex = /TIP_TITLE:\s*(.+)\nTIP_DESCRIPTION:\s*(.+)\nTIP_CONTEXT:\s*(.+)/g;
    const tips = [];
    let match;
    
    while ((match = tipRegex.exec(tipsText)) !== null) {
      tips.push({
        title: match[1].trim(),
        description: match[2].trim(),
        context: match[3].trim()
      });
    }
    
    return tips.length > 0 ? tips : getDefaultSavingTips();
  } catch (error) {
    console.error("Error generating saving tips:", error);
    return getDefaultSavingTips();
  }
}

/**
 * Get default saving tips if AI generation fails
 */
function getDefaultSavingTips() {
  return [
    {
      title: "Shopping",
      description: "Consider using price comparison tools and waiting for sales to purchase non-essential items.",
      context: "Online purchases|$320|$250" // Current|Target amounts
    },
    {
      title: "Dining",
      description: "Making coffee at home instead of buying takeout coffee can save you around $70/month.",
      context: "Coffee & takeout|$150|$80" // Current|Target amounts
    },
    {
      title: "Utilities",
      description: "Switch to LED bulbs and install a programmable thermostat to reduce energy costs.",
      context: "Energy savings|$210|$175" // Current|Target amounts
    }
  ];
}




/**
 * Generate a complete financial report including predictions and saving tips
 */
export async function generateFinancialReport(): Promise<FinancialReportData> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  
  if (!user) {
    throw new Error("User not found");
  }

  // Get previous month (for report analysis) and current month (for predictions)
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-indexed current month
  const currentYear = today.getFullYear();
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = previousMonth === 12 ? currentYear - 1 : currentYear;

  // Get month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const previousMonthName = monthNames[previousMonth - 1];
  // const currentMonthName = monthNames[currentMonth - 1];

  // Check if report already exists for previous month
  const existingReport = await prisma.financialReport.findUnique({
    where: {
      userId_month_year: {
        userId: user.id,
        month: previousMonth,
        year: previousYear
      }
    },
    include: {
      savingsTips: true
    }
  });

  if (existingReport) {
    // Return existing report
    return {
      ...existingReport,
      spendingBreakdown: existingReport.spendingBreakdown as unknown as SpendingCategory[],
      monthName: previousMonthName
    };
  }

  // Generate data for the report based on previous month
  const financialData = await getFinancialReportData(previousMonth, previousYear);
  
  // Generate AI predictions for current month
  const predictions = await generateFinancialPredictions(currentMonth, currentYear);
  
  // Use spending breakdown from previous month
  const spendingBreakdown = financialData.spendingBreakdown;
  
  // Generate personalized saving tips based on previous month's spending
  const savingTips = await generateSavingTips(
    spendingBreakdown, 
    financialData.totalIncome,
    financialData.totalExpenses
  );
  
  // Create the report (focused on previous month with predictions for current month)
  const newReport = await prisma.financialReport.create({
    data: {
      title: `Financial Report - ${previousMonthName} ${previousYear}`,
      month: previousMonth,
      year: previousYear,
      totalIncome: financialData.totalIncome,
      totalExpenses: financialData.totalExpenses,
      savingsRate: financialData.savingsRate,
      spendingBreakdown,
      predictedIncome: predictions.predictedIncome,
      predictedExpenses: predictions.predictedExpenses,
      predicetedCashFlow: predictions.predictedCashFlow,
      userId: user.id,
      savingsTips: {
        create: savingTips
      }
    },
    include: {
      savingsTips: true
    }
  });
  
  return {
    ...newReport,
    spendingBreakdown: newReport.spendingBreakdown as unknown as SpendingCategory[],
    monthName: previousMonthName
  };
}


