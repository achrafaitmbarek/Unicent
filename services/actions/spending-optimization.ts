"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Anthropic from '@anthropic-ai/sdk';
import { OptimizationPriority, Transaction, TransactionCategory, TransactionFlow } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
type CategorySpending = {
  category: string;
  currentSpending: number;
  spendingPercentage: number;
  transactions: Transaction[]; 
};


export type Recommendation = {
  category: string;
  currentSpending: number;
  recommendedSpending: number;
  potentialSavings: number;
  spendingPercentage: number;
  title: string;
  description: string;
  subdescription?: string;
  priority: OptimizationPriority;
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Get or create spending optimization report
export async function getSpendingOptimizationReport(month?: number, year?: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  
  // Default to last month if not specified
  if (!month || !year) {
    const today = new Date();
    year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    month = today.getMonth() === 0 ? 12 : today.getMonth();
  }
  
  // Check if report exists
  let report = await prisma.spendingOptimizationReport.findUnique({
    where: {
      userId_month_year: {
        userId: session.user.id,
        month,
        year
      }
    },
    include: { recommendations: true }
  });
  
  if (!report) {
    // Generate new report
    report = await generateSpendingOptimizationReport(session.user.id, month, year);
  }
  
  return report;
}

async function generateSpendingOptimizationReport(userId: string, month: number, year: number) {
  // First, delete any existing report for this month
  await prisma.spendingOptimizationReport.deleteMany({
    where: {
      userId,
      month,
      year
    }
  });
  
  // 1. Get monthly transactions
  const monthlyTransactions = await getMonthlyTransactions(userId, month, year);
  
  // 2. Analyze spending by category
  const categorySpending = analyzeSpendingByCategory(monthlyTransactions);
  
  // 3. Generate recommendations with AI
  const recommendations: Recommendation[] = await generateRecommendations(categorySpending);
  
  // 4. Calculate totals
  const totalCurrentSpending = recommendations.reduce((sum, rec) => {
    return sum + (typeof rec.currentSpending === 'number' ? rec.currentSpending : 0);
  }, 0);
  
  const totalRecommendedSpending = recommendations.reduce((sum, rec) => {
    return sum + (typeof rec.recommendedSpending === 'number' ? rec.recommendedSpending : 0);
  }, 0);
  
  const totalPotentialSavings = parseFloat((totalCurrentSpending - totalRecommendedSpending).toFixed(2));
  const totalActualSpending = monthlyTransactions.reduce((sum, tx) => {
    return sum + Math.abs(tx.value);
  }, 0);
  // 5. Create the report
  const report = await prisma.spendingOptimizationReport.create({
    data: {
      userId,
      month,
      year,
      totalCurrentSpending: totalActualSpending,
      totalRecommendedSpending,
      totalPotentialSavings,
      recommendations: {
        create: recommendations.map(rec => ({

          category: rec.category as TransactionCategory,
          currentSpending: rec.currentSpending,
          recommendedSpending: rec.recommendedSpending,
          potentialSavings: rec.potentialSavings,
          spendingPercentage: rec.spendingPercentage,
          title: rec.title,
          description: rec.description,
          subdescription: rec.subdescription,
          priority: rec.priority
        }))
      }
    },
    include: {
      recommendations: true
    }
  });
  
  return report;
}

async function getMonthlyTransactions(userId: string, month: number, year: number) {
  const connections = await prisma.bankConnection.findMany({
    where: { userId },
    include: { accounts: true },
  });
  
  const accountIds = connections.flatMap(conn => 
    conn.accounts.map(account => account.pk)
  );
  
  // Get transactions for specified month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return prisma.transaction.findMany({
    where: {
      accountId: { in: accountIds },
      date: {
        gte: startDate,
        lte: endDate
      },
      flow: TransactionFlow.EXPENSE
    }
  });
}

function analyzeSpendingByCategory(transactions: Transaction[]): CategorySpending[] {
  const categoryData: Record<string, {total: number, transactions: Transaction[]}> = {};
  let totalExpenses = 0;
  
  transactions.forEach(tx => {
    if (!categoryData[tx.category]) {
      categoryData[tx.category] = {
        total: 0,
        transactions: []
      };
    }
    
    const amount = Math.abs(tx.value);
    categoryData[tx.category].total += amount;
    categoryData[tx.category].transactions.push(tx);
    totalExpenses += amount;
  });
  
  // Calculate percentages and add metadata
  return Object.entries(categoryData).map(([category, data]) => {
    const { total, transactions } = data ;
    const percentage = (total / totalExpenses) * 100;
    
    return {
      category,
      currentSpending: total,
      spendingPercentage: percentage,
      transactions
    };
  });
}

async function generateRecommendations(
  categorySpending: CategorySpending[]
): Promise<Recommendation[]> {
  // Create a detailed analysis for the AI
  let spendingAnalysis = "Monthly Spending Analysis:\n\n";
  
  categorySpending.forEach(category => {
    spendingAnalysis += `Category: ${category.category}\n`;
    spendingAnalysis += `Current Spending: $${category.currentSpending.toFixed(2)}\n`;
    spendingAnalysis += `Percentage of Total: ${category.spendingPercentage.toFixed(2)}%\n\n`;
    spendingAnalysis += `Sample Transactions:\n`;
    
    category.transactions.slice(0, 3).forEach(tx => {
      spendingAnalysis += `  - ${tx.wording}: $${Math.abs(tx.value).toFixed(2)}\n`;
    });
    
    spendingAnalysis += '\n';
  });
  
  // Generate recommendations with Claude
  const aiResponse = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1500,
    temperature: 0.7,
    system: "You're a financial advisor providing personalized spending optimization recommendations.",
    messages: [{
      role: "user",
      content: `Based on this monthly spending analysis, provide optimization recommendations for each spending category.
      
      ${spendingAnalysis}
      
      
      For each category with significant spending, provide:
      1. Recommended spending amount (realistic reduction)
      2. Potential monthly savings amount
      3. Priority level (HIGH for categories with largest potential savings, MEDIUM for moderate savings, LOW for minimal savings)
      4. A specific, actionable tip with main description and subdescription
      
      Format your response as JSON:
      [
        {
          "category": "CATEGORY_NAME",
          "currentSpending": current_amount,
          "recommendedSpending": recommended_amount,
          "potentialSavings": savings_amount,
          "priority": "HIGH|MEDIUM|LOW",
          "title": "Short tip title",
          "description": "Main description with specific saving amount",
          "subdescription": "Additional details and specific tactics"
        },
        ...
      ]`
    }]
  });
  
  try {
    if ('text' in aiResponse.content[0]) {
      const text = aiResponse.content[0].text;
      const jsonMatch = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      
      if (jsonMatch) {
        const parsedRecommendations = JSON.parse(jsonMatch[0]);
        
        interface ParsedRecommendation {
          category: string;
          currentSpending: number;
          recommendedSpending: number;
          potentialSavings: number;
          priority: OptimizationPriority;
          title: string;
          description: string;
          subdescription?: string;
        }
                return parsedRecommendations.map((rec: ParsedRecommendation): Recommendation => ({
                  category: rec.category,
                  currentSpending: rec.currentSpending,
                  recommendedSpending: rec.recommendedSpending,
                  potentialSavings: rec.potentialSavings,
                  spendingPercentage: categorySpending.find(c => c.category === rec.category)?.spendingPercentage || 0,
                  title: rec.title,
                  description: rec.description,
                  subdescription: rec.subdescription,
                  priority: rec.priority
                }));
      }
    }
    
    // Fallback if parsing fails
    return createFallbackRecommendations(categorySpending);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return createFallbackRecommendations(categorySpending);
  }
}


function createFallbackRecommendations(categorySpending: CategorySpending[]): Recommendation[] {
  const sortedCategories = [...categorySpending].sort((a, b) => 
    b.currentSpending - a.currentSpending
  );
  
  return sortedCategories.map((category) => {
    let reductionPercentage = 0.1; 
    
    let priority: OptimizationPriority = OptimizationPriority.LOW;
    
    let title = "";
    let description = "";
    let subdescription = "";
    
    switch (category.category) {
      case "DINING":
        reductionPercentage = 0.2;
        title = "Reduce Dining Expenses";
        description = `Your dining expenses are ${category.spendingPercentage.toFixed(1)}% of your budget. Cook more at home to save around $${(category.currentSpending * reductionPercentage).toFixed(2)}/month.`;
        subdescription = "Meal prep on weekends can save both time and money during busy weekdays.";
        priority = category.spendingPercentage > 15 ? OptimizationPriority.HIGH : OptimizationPriority.MEDIUM;
        break;
        
      case "SHOPPING":
        reductionPercentage = 0.25;
        title = "Optimize Shopping Habits";
        description = `Shopping accounts for ${category.spendingPercentage.toFixed(1)}% of your expenses. Consider a 30-day wait rule for non-essential purchases.`;
        subdescription = "Creating a shopping list and sticking to it can reduce impulse buys significantly.";
        priority = category.spendingPercentage > 20 ? OptimizationPriority.HIGH : OptimizationPriority.MEDIUM;
        break;
        
      case "ENTERTAINMENT":
        reductionPercentage = 0.15;
        title = "Trim Entertainment Costs";
        description = `Entertainment makes up ${category.spendingPercentage.toFixed(1)}% of your spending. Review your subscriptions and keep only what you regularly use.`;
        subdescription = "Consider free alternatives like library resources, community events, or free streaming services.";
        priority = OptimizationPriority.MEDIUM;
        break;
        
      case "TRANSPORTATION":
        reductionPercentage = 0.15;
        title = "Optimize Transportation";
        description = `Transportation costs are ${category.spendingPercentage.toFixed(1)}% of expenses. Consider carpooling, public transit, or combining trips.`;
        subdescription = "Regular vehicle maintenance and proper tire inflation can improve fuel efficiency by up to 3%.";
        priority = category.spendingPercentage > 15 ? OptimizationPriority.HIGH : OptimizationPriority.MEDIUM;
        break;
        
      case "UTILITIES":
        reductionPercentage = 0.12;
        title = "Reduce Utility Bills";
        description = `Utilities represent ${category.spendingPercentage.toFixed(1)}% of your budget. Small changes in usage can lead to meaningful savings.`;
        subdescription = "Smart thermostats, LED bulbs, and unplugging unused electronics can reduce your monthly bills.";
        priority = OptimizationPriority.MEDIUM;
        break;
        
      default:
        // For all other categories, use generic recommendations
        if (category.currentSpending > 500) {
          reductionPercentage = 0.15;
          priority = OptimizationPriority.HIGH;
        } else if (category.currentSpending > 200) {
          reductionPercentage = 0.12;
          priority = OptimizationPriority.MEDIUM;
        } else {
          reductionPercentage = 0.08;
          priority = OptimizationPriority.LOW;
        }
        
        title = `Optimize ${category.category.toLowerCase().replace('_', ' ')} Spending`;
        description = `This category represents ${category.spendingPercentage.toFixed(1)}% of your monthly expenses. Consider ways to reduce by about ${(reductionPercentage * 100).toFixed(0)}%.`;
        subdescription = "Look for alternatives, compare prices, or consider if some expenses can be delayed or eliminated.";
    }
    
    const recommendedSpending = category.currentSpending * (1 - reductionPercentage);
    const potentialSavings = category.currentSpending - recommendedSpending;
    console.log('fallback rec down')
    
    return {
      category: category.category as TransactionCategory,
      currentSpending: category.currentSpending,
      recommendedSpending: parseFloat(recommendedSpending.toFixed(2)),
      potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      spendingPercentage: category.spendingPercentage,
      title,
      description,
      subdescription,
      priority
    };
  });
}



/**
 * Get spending optimization data formatted for display
 * @param month Month number (1-12)
 * @param year Year (e.g., 2025)
 * @param includeTransactions Whether to include sample transactions in the result
 * @returns Formatted spending optimization data ready for UI
 */
export async function getSpendingOptimizationDisplayData(month?: number, year?: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Authentication required");
    }
    
    // Get user info including premium status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true }
    });
    
    const today = new Date();
    const currentMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    const currentYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    
    if (!month || !year) {
      month = currentMonth;
      year = currentYear;
    }

    if (!user?.isPremium) {

      const requestedMonthsBack = (currentYear - year) * 12 + (currentMonth - month);
      
      if (requestedMonthsBack > 3) {

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
        
        month = threeMonthsAgo.getMonth() + 1;
        year = threeMonthsAgo.getFullYear();
      }
    }
    
    // Get the report or generate a new one
    const report = await getSpendingOptimizationReport(month, year);
    
    // Format month name for display
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    
    if (report) {
    const recommendations = report.recommendations.map(rec => {
      return {
        id: rec.id,
        category: rec.category,
        categoryLabel: rec.category.toLowerCase().replace(/_/g, ' '),
        currentSpending: rec.currentSpending,
        currentSpendingFormatted: formatCurrency(rec.currentSpending),
        recommendedSpending: rec.recommendedSpending,
        recommendedSpendingFormatted: formatCurrency(rec.recommendedSpending),
        potentialSavings: rec.potentialSavings,
        potentialSavingsFormatted: formatCurrency(rec.potentialSavings),
        spendingPercentage: rec.spendingPercentage,
        spendingPercentageFormatted: `${rec.spendingPercentage.toFixed(1)}%`,
        title: rec.title,
        description: rec.description,
        subdescription: rec.subdescription,
        priority: rec.priority,
        priorityLabel: rec.priority.charAt(0) + rec.priority.slice(1).toLowerCase(),
        createdAt: rec.createdAt,
        statusColor: 
          rec.priority === 'HIGH' ? 'red' : 
          rec.priority === 'MEDIUM' ? 'orange' : 'green',
      };
    });
    
    // Sort recommendations by priority
    const sortedRecommendations = recommendations.sort((a, b) => {
      const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // LIMIT RECOMMENDATIONS FOR NON-PREMIUM USERS
    // If user is not premium, only return top 3 recommendations
    const limitedRecommendations = user?.isPremium 
      ? sortedRecommendations 
      : sortedRecommendations.slice(0, 3);
  
    
  
    return {
      month,
      year,
      monthName,
      monthYear: `${monthName} ${year}`,
      summary: {
        totalCurrentSpending: report.totalCurrentSpending,
        totalCurrentSpendingFormatted: formatCurrency(report.totalCurrentSpending),
        totalRecommendedSpending: report.totalRecommendedSpending,
        totalRecommendedSpendingFormatted: formatCurrency(report.totalRecommendedSpending),
        totalPotentialSavings: report.totalPotentialSavings,
        totalPotentialSavingsFormatted: formatCurrency(report.totalPotentialSavings),
        savingsPercentage: (report.totalPotentialSavings / report.totalCurrentSpending) * 100,
        savingsPercentageFormatted: `${((report.totalPotentialSavings / report.totalCurrentSpending) * 100).toFixed(1)}%`,
      },
      recommendations: limitedRecommendations,
      hasData: recommendations.length > 0,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      isLimited: !user?.isPremium && sortedRecommendations.length > 3,
      isPremium: user?.isPremium || false,
      totalRecommendations: sortedRecommendations.length
    };
  }else{
    return {
      month,
      year,
      monthName,
      monthYear: `${monthName} ${year}`,
      summary: {
        totalCurrentSpending: 0,
        totalCurrentSpendingFormatted: formatCurrency(0),
        totalRecommendedSpending: 0,
        totalRecommendedSpendingFormatted: formatCurrency(0),
        totalPotentialSavings: 0,
        totalPotentialSavingsFormatted: formatCurrency(0),
        savingsPercentage: 0,
        savingsPercentageFormatted: "0%",
      },
      recommendations: [],
      hasData: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isLimited: false,
      isPremium: user?.isPremium || false,
      totalRecommendations: 0
    };
  }
  } catch (error) {
    console.error("Error getting spending optimization display data:", error);
    throw error;
  }
}