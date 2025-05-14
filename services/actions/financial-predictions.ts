"use server";

import Anthropic from '@anthropic-ai/sdk';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { TransactionFlow } from "@prisma/client";

interface HistoricalData {
  monthlyData: {
    month: number;
    year: number;
    incomeTotal: number;
    expenseTotal: number;
    cashFlow: number;
    incomeByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }[];
  totalMonthsAnalyzed: number;
}


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate financial predictions for the upcoming month based on transaction history
 */
export async function generateFinancialPredictions(targetMonth?: number, targetYear?: number) {
  try {
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

    // Set target month to next month if not provided
    const today = new Date();
    if (!targetMonth || !targetYear) {
      targetMonth = today.getMonth() + 2; // Next month (accounting for 0-indexed months)
      targetYear = today.getFullYear();
      
      // Handle year rollover
      if (targetMonth > 12) {
        targetMonth = 1;
        targetYear += 1;
      }
    }

    // Get historical transaction data for analysis
    const historicalData = await getHistoricalTransactionData(user.id);
    
    // If we don't have enough data, return fallback predictions
    if (!historicalData.monthlyData || historicalData.monthlyData.length === 0) {
      return getFallbackPredictions(targetMonth, targetYear);
    }
    
    // Create prompt for AI
    const prompt = createFinancialPredictionPrompt(historicalData, targetMonth, targetYear);
    
    console.log("Generating financial predictions with prompt:", prompt);
    
    // Call Claude API for predictions
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.2, // Lower temperature for more deterministic predictions
      system: "You are a financial analyst providing precise numerical predictions based on historical financial data. Your predictions should be realistic and include justifications.",
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    if ('text' in response.content[0]) {
      const predictions = parsePredictions(response.content[0].text);
      return {
        ...predictions,
        targetMonth,
        targetYear,
      };
    }
    
    return getFallbackPredictions(targetMonth, targetYear);
  } catch (error) {
    console.error("Error generating financial predictions:", error);
    const today = new Date();
    const defaultMonth = today.getMonth() + 2 > 12 ? 1 : today.getMonth() + 2;
    const defaultYear = today.getMonth() + 2 > 12 ? today.getFullYear() + 1 : today.getFullYear();
    return getFallbackPredictions(targetMonth ?? defaultMonth, targetYear ?? defaultYear);
  }
}

/**
 * Get historical transaction data summarized by month for the past several months
 */
async function getHistoricalTransactionData(userId: string) {
  // First, find all bank connections for this user
  const bankConnections = await prisma.bankConnection.findMany({
    where: { userId },
    select: { id: true },
  });
  
  const connectionIds = bankConnections.map(connection => connection.id);
  
  // Get all bank accounts for these connections
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { connectionId: { in: connectionIds } },
    select: { pk: true },
  });
  
  const accountPks = bankAccounts.map(account => account.pk);
  
  // Get transactions for the past 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const transactions = await prisma.transaction.findMany({
    where: {
      accountId: { in: accountPks },
      date: { gte: threeMonthsAgo },
    },
    orderBy: { date: 'desc' },
  });
  
  // Group transactions by month and calculate totals
  const monthlyData: Record<string, { 
    month: number;
    year: number;
    incomeTotal: number;
    expenseTotal: number;
    cashFlow: number;
    incomeByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }> = {};
  
  transactions.forEach(tx => {
    const date = new Date(tx.date);
    const month = date.getMonth() + 1; // 1-indexed month
    const year = date.getFullYear();
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    
    // Initialize month data if needed
    if (!monthlyData[key]) {
      monthlyData[key] = {
        month,
        year,
        incomeTotal: 0,
        expenseTotal: 0,
        cashFlow: 0,
        incomeByCategory: {},
        expensesByCategory: {},
      };
    }
    
    const amount = Math.abs(tx.value);
    
    // Update appropriate totals
    if (tx.flow === TransactionFlow.INCOME) {
      monthlyData[key].incomeTotal += amount;
      
      // Update income by category
      if (!monthlyData[key].incomeByCategory[tx.category]) {
        monthlyData[key].incomeByCategory[tx.category] = 0;
      }
      monthlyData[key].incomeByCategory[tx.category] += amount;
    } else {
      monthlyData[key].expenseTotal += amount;
      
      // Update expenses by category
      if (!monthlyData[key].expensesByCategory[tx.category]) {
        monthlyData[key].expensesByCategory[tx.category] = 0;
      }
      monthlyData[key].expensesByCategory[tx.category] += amount;
    }
    
    // Calculate cash flow
    monthlyData[key].cashFlow = monthlyData[key].incomeTotal - monthlyData[key].expenseTotal;
  });
  
  // Convert to array and sort by date (most recent first)
  const monthlyDataArray = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
  
  return {
    monthlyData: monthlyDataArray,
    totalMonthsAnalyzed: monthlyDataArray.length,
  };
}

/**
 * Create a prompt for the AI to generate financial predictions
 */
function createFinancialPredictionPrompt(historicalData: HistoricalData, targetMonth: number, targetYear: number) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const targetMonthName = monthNames[targetMonth - 1];
  
  let prompt = `Based on the following financial history, predict the income, expenses, and cash flow for ${targetMonthName} ${targetYear}.\n\n`;
  
  prompt += `Monthly Financial History:\n\n`;
  
  historicalData.monthlyData.forEach((month) => {
    prompt += `${monthNames[month.month - 1]} ${month.year}:\n`;
    prompt += `- Total Income: $${month.incomeTotal.toFixed(2)}\n`;
    prompt += `- Total Expenses: $${month.expenseTotal.toFixed(2)}\n`;
    prompt += `- Cash Flow: $${month.cashFlow.toFixed(2)}\n`;
    
    // Add top income sources
    prompt += `- Top Income Sources:\n`;
    const topIncomes = Object.entries(month.incomeByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    topIncomes.forEach(([category, amount]) => {
      prompt += `  * ${category}: $${amount.toFixed(2)}\n`;
    });
    
    // Add top expense categories
    prompt += `- Top Expense Categories:\n`;
    const topExpenses = Object.entries(month.expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    topExpenses.forEach(([category, amount]) => {
      prompt += `  * ${category}: $${amount.toFixed(2)}\n`;
    });
    
    prompt += `\n`;
  });
  
  prompt += `Given this historical data, analyze trends and patterns to predict:\n`;
  prompt += `1. Total income for ${targetMonthName} ${targetYear}\n`;
  prompt += `2. Total expenses for ${targetMonthName} ${targetYear}\n`;
  prompt += `3. Cash flow for ${targetMonthName} ${targetYear}\n\n`;
  
  prompt += `Please format your response exactly as follows:\n`;
  prompt += `PREDICTED_INCOME: [dollar amount]\n`;
  prompt += `PREDICTED_EXPENSES: [dollar amount]\n`;
  prompt += `PREDICTED_CASH_FLOW: [dollar amount]\n\n`;
  prompt += `EXPLANATION: [brief explanation of your reasoning]\n`;
  
  return prompt;
}

/**
 * Parse the AI response to extract predictions
 */
function parsePredictions(text: string) {
  // Extract predicted values using regex
  const incomeMatch = text.match(/PREDICTED_INCOME:\s*\$?([\d,]+(\.\d{1,2})?)/);
  const expensesMatch = text.match(/PREDICTED_EXPENSES:\s*\$?([\d,]+(\.\d{1,2})?)/);
  const cashFlowMatch = text.match(/PREDICTED_CASH_FLOW:\s*\$?([\d,]+(\.\d{1,2})?)/);
  const explanationMatch = text.match(/EXPLANATION:\s*([\s\S]+?)(\n\n|$)/);
  
  // Parse values, removing commas and converting to float
  const predictedIncome = incomeMatch ? parseFloat(incomeMatch[1].replace(/,/g, '')) : 0;
  const predictedExpenses = expensesMatch ? parseFloat(expensesMatch[1].replace(/,/g, '')) : 0;
  const predictedCashFlow = cashFlowMatch ? parseFloat(cashFlowMatch[1].replace(/,/g, '')) : 0;
  const explanation = explanationMatch ? explanationMatch[1].trim() : '';
  
  return {
    predictedIncome,
    predictedExpenses,
    predictedCashFlow, // Note: Keep typo from schema (predicetedCashFlow)
    explanation,
  };
}

/**
 * Fallback predictions when we don't have enough data
 */
function getFallbackPredictions(targetMonth: number, targetYear: number) {
  return {
    predictedIncome: 5000,
    predictedExpenses: 3500,
    predictedCashFlow: 1500,
    explanation: "Fallback prediction based on typical household finances.",
    targetMonth,
    targetYear,
  };
}

// Add to financial-predictions.ts

/**
 * Generate and save financial predictions for a user's financial report
 */
export async function generateAndSaveFinancialPredictions(reportId: string) {
  try {
    // First get the report to see which month/year we're predicting for
    const report = await prisma.financialReport.findUnique({
      where: { id: reportId },
      select: { 
        userId: true, 
        month: true, 
        year: true,
        predictedIncome: true,
        predictedExpenses: true,
        predicetedCashFlow: true 
      },
    });
    
    if (!report) {
      throw new Error("Report not found");
    }
    
    // Check if predictions already exist
    if (report.predictedIncome > 0 && report.predictedExpenses > 0) {
      console.log("Predictions already exist for this report");
      return {
        predictedIncome: report.predictedIncome,
        predictedExpenses: report.predictedExpenses,
        predicetedCashFlow: report.predicetedCashFlow,
      };
    }
    
    // Target month is current month + 1 (we're predicting next month)
    let targetMonth = report.month + 1;
    let targetYear = report.year;
    
    // Handle year rollover
    if (targetMonth > 12) {
      targetMonth = 1;
      targetYear += 1;
    }
    
    // Generate the predictions
    const predictions = await generateFinancialPredictions(targetMonth, targetYear);
    
    // Update the report with the predictions
    const updatedReport = await prisma.financialReport.update({
      where: { id: reportId },
      data: {
        predictedIncome: predictions.predictedIncome,
        predictedExpenses: predictions.predictedExpenses,
        predicetedCashFlow: predictions.predictedCashFlow,
      },
    });
    
    return {
      predictedIncome: updatedReport.predictedIncome,
      predictedExpenses: updatedReport.predictedExpenses,
      predicetedCashFlow: updatedReport.predicetedCashFlow,
    };
  } catch (error) {
    console.error("Error saving financial predictions:", error);
    throw error;
  }
}