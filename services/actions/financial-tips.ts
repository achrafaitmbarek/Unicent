"use server";

import Anthropic from '@anthropic-ai/sdk';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Transaction } from "@prisma/client";
import { TipType } from "@prisma/client";


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type FinancialTip = {
  id?: string;
  title: string;
  description: string;
  type?: TipType;
};

export async function getFinancialTips(tipType: TipType = TipType.DAILY_INSIGHT) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return getFallbackTips();
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promptData: any = {};
    let prompt: string;
    
    switch (tipType) {
      case TipType.GOAL_BASED:
        const goalData = await getGoalBasedTipData(session.user.id);
        promptData = goalData;
        prompt = createGoalBasedPrompt(goalData);
        break;
        
      case TipType.SPIKE:
        const spikeData = await getUnusualTransactionData(session.user.id);
        promptData = spikeData;
        
        if (spikeData.unusualTransactions.length === 0) {
          console.log("No unusual transactions found, falling back to daily insights");
          const transactions = await getRecentTransactions(session.user.id);
          if (transactions.length === 0) return getFallbackTips();
          
          const summary = createTransactionSummary(transactions);
          promptData.summary = summary;
          prompt = createDailyInsightPrompt({ summary });
        } else {
          prompt = createSpikePrompt(spikeData);
        }
        break;
        
      case TipType.DAILY_INSIGHT:
      default:
        const transactions = await getRecentTransactions(session.user.id);
        if (transactions.length === 0) return getFallbackTips();
        
        const summary = createTransactionSummary(transactions);
        promptData = { summary };
        prompt = createDailyInsightPrompt({ summary });
        break;
    }
    
    console.log(`Generating ${tipType} tips with prompt:`, prompt);
    
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", 
      max_tokens: 1000,
      temperature: 0.7,
system: "You're a financial advisor providing personalized tips directly to the user. Always use 'you' and 'your' instead of 'the user' or 'their' when addressing the user.",
      messages: [{
        role: "user",
        content: prompt
      }]
    });
    
    if ('text' in response.content[0]) {
      const tips = parseTips(response.content[0].text);
      return tips.map(tip => ({ ...tip, type: tipType }));
    }
    
    return getFallbackTips().map(tip => ({ ...tip, type: tipType }));
  } catch (error) {
    console.error(`Error generating ${tipType} financial tips:`, error);
    return getFallbackTips().map(tip => ({ ...tip, type: tipType }));
  }
}

async function getRecentTransactions(userId: string, limit = 20) {
  const connections = await prisma.bankConnection.findMany({
    where: { userId },
    include: { accounts: true },
  });
  
  const accountIds = connections.flatMap(conn => 
    conn.accounts.map(account => account.pk)
  );
  
  return prisma.transaction.findMany({
    where: {
      accountId: { in: accountIds },
    },
    orderBy: {
      date: 'desc'
    },
    take: limit
  });
}

function createTransactionSummary(transactions: Transaction[]) {
  const categories: Record<string, { total: number, count: number }> = {};
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(tx => {
    const category = tx.category;
    const amount = tx.value;
    
    if (!categories[category]) {
      categories[category] = { total: 0, count: 0 };
    }
    
    categories[category].total += amount;
    categories[category].count += 1;
    
    if (tx.flow === 'INCOME') {
      totalIncome += amount;
    } else {
      totalExpenses += Math.abs(amount);
    }
  });
  
  let summary = "Monthly Transaction Summary:\n\n";
  
  Object.entries(categories).forEach(([category, data]) => {
    summary += `${category}: $${Math.abs(data.total).toFixed(2)} (${data.count} transactions)\n`;
  });
  

  summary += `\nTotal Income: $${totalIncome.toFixed(2)}\n`;
  summary += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
  
  return summary;
}

function parseTips(text: string): FinancialTip[] {
  const tips: FinancialTip[] = [];
  const regex = /\d+\.\s+([^:]+):\s+([^\n]+)/g;
  
  let match;
  while ((match = regex.exec(text)) && tips.length < 4) {
    tips.push({
      title: match[1].trim(),
      description: match[2].trim()
    });
  }
  
  return tips.length > 0 ? tips : getFallbackTips();
}

async function getGoalBasedTipData(userId: string) {
  const goals = await prisma.financialGoal.findMany({
    where: { userId }
  });
  
  const connections = await prisma.bankConnection.findMany({
    where: { userId },
    include: { accounts: true },
  });
  
  const accounts = connections.flatMap(conn => conn.accounts);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  return { goals, totalBalance, accounts };
}
async function detectUnusualTransactionsWithAI(transactions: Transaction[], userId: string) {
  if (transactions.length === 0) return [];
  
  // Create a detailed transaction list instead of just a summary
  let transactionDetails = "Recent Transactions:\n\n";
  
  transactions.forEach(tx => {
    transactionDetails += `ID: ${tx.id}\n`;
    transactionDetails += `Date: ${tx.date.toISOString().split('T')[0]}\n`;
    transactionDetails += `Description: ${tx.wording}\n`;
    transactionDetails += `Amount: $${Math.abs(tx.value).toFixed(2)}\n`;
    transactionDetails += `Category: ${tx.category}\n`;
    transactionDetails += `Type: ${tx.flow}\n\n`;
  });
  
  // Also include the summary for context
  const summary = createTransactionSummary(transactions);
  
  // Ask the AI to identify unusual transactions
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    temperature: 0.3,
    system: "You're a financial analyst identifying unusual transactions in a user's spending history. Look for transactions that are significantly larger than normal, in unusual categories, or that show suspicious patterns.",
    messages: [{
      role: "user",
      content: `Analyze these transactions and identify any that appear unusual or concerning:
      
      ${transactionDetails}
      
      Summary of Transactions:
      ${summary}
      
      IMPORTANT: Identify 1-3 transactions that appear most unusual (higher than normal amounts, unusual categories, suspicious timing, etc.)
      
      Format your response EXACTLY as:
      UNUSUAL_TRANSACTION_IDS: [id1, id2, ...]
      
      ANALYSIS:
      id1: reason this is unusual
      id2: reason this is unusual
      ...`
    }]
  });
  
  if ('text' in response.content[0]) {
    // Extract the unusual transaction IDs - improve the regex to be more flexible
    const text = response.content[0].text;
    console.log("AI response:", text);
    
    // More flexible pattern matching
    const idMatch = text.match(/UNUSUAL_TRANSACTION_IDS:\s*\[([\s\S]*?)\]/);
    
    if (idMatch && idMatch[1]) {
      // More robust ID extraction
      const idStrings = idMatch[1].replace(/\s+/g, '').split(',');
      const unusualIds = idStrings.filter(id => id && !isNaN(parseInt(id, 10))).map(id => parseInt(id, 10));
      
      console.log("Detected unusual transaction IDs:", unusualIds);
      
      if (unusualIds.length > 0) {
        // Extract reasons using a more flexible regex
        const reasons: Record<string, string> = {};
        const reasonRegex = /(\d+)[\s:]+([^\n]+)/g;
        let reasonMatch;
        
        while ((reasonMatch = reasonRegex.exec(text)) !== null) {
          reasons[reasonMatch[1]] = reasonMatch[2].trim();
        }
        
        // Mark these transactions as unusual in the database
        for (const id of unusualIds) {
          try {
            await prisma.transaction.updateMany({
              where: {
                id: id,
                account: {
                  connection: {
                    userId: userId
                  }
                }
              },
              data: {
                isUnusual: true,
                anomalyReason: reasons[id.toString()] || "Identified as unusual by AI analysis"
              }
            });
          } catch (error) {
            console.error(`Error updating transaction ${id}:`, error);
          }
        }
        
        // Return the newly marked unusual transactions
        const markedTransactions = await prisma.transaction.findMany({
          where: {
            id: { in: unusualIds },
            account: {
              connection: {
                userId: userId
              }
            }
          }
        });
        
        return markedTransactions;
      }
    } else {
      console.log("No unusual transaction IDs found in AI response");
    }
  }
  
  return [];
}

async function getUnusualTransactionData(userId: string) {
  const connections = await prisma.bankConnection.findMany({
    where: { userId },
    include: { accounts: true },
  });
  
  const accountIds = connections.flatMap(conn => 
    conn.accounts.map(account => account.pk)
  );
  
  // First try to get pre-flagged unusual transactions
  let unusualTransactions = await prisma.transaction.findMany({
    where: {
      accountId: { in: accountIds },
      isUnusual: true
    },
    orderBy: {
      date: 'desc'
    },
    take: 10
  });
  
  // If no unusual transactions found, use AI to detect them
  if (unusualTransactions.length === 0) {
    console.log("No pre-flagged unusual transactions, using AI to detect anomalies");
    
    // Get recent transactions for AI analysis
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
      },
      orderBy: {
        date: 'desc'
      },
      take: 100 // Analyze a significant number of transactions for patterns
    });
    
    // Use AI to detect unusual transactions
    const detectedUnusualTxs = await detectUnusualTransactionsWithAI(recentTransactions, userId);
    
    // If AI found unusual transactions, use them
    if (detectedUnusualTxs.length > 0) {
      unusualTransactions = detectedUnusualTxs;
    }
  }
  
  return { unusualTransactions };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createGoalBasedPrompt(data: { goals: any[], totalBalance: number }): string {
  const { goals, totalBalance } = data;
  
  if (goals.length === 0) {
    return `The user has a total balance of $${totalBalance.toFixed(2)} but hasn't set any financial goals yet. 
    
    Provide 4 specific financial tips about setting and achieving financial goals. For each tip:
    1. Short title (max 30 chars)
    2. Brief description (max 200 chars)
    
    Format as:
    1. Title 1: Description 1
    2. Title 2: Description 2
    3. Title 3: Description 3
    4. Title 4: Description 4`;
  }
  
  let prompt = `The user has the following financial goals:\n\n`;
  
  goals.forEach(goal => {
    prompt += `- Goal: ${goal.name}\n`;
    prompt += `  Amount: $${goal.amount.toFixed(2)}\n`;
    prompt += `  Target Date: ${goal.targetDate.toISOString().split('T')[0]}\n`;
    prompt += `  Category: ${goal.category}\n`;
    prompt += `  Monthly Allocation: ${goal.monthlyAllocationPct}%\n\n`;
  });
  
  prompt += `Their current total balance across accounts is $${totalBalance.toFixed(2)}.\n\n`;
  
  prompt += `Provide 4 specific financial tips to help them reach their goals. For each tip:
  1. Short title (max 30 chars)
  2. Brief description (max 200 chars)
  
  Format as:
  1. Title 1: Description 1
  2. Title 2: Description 2
  3. Title 3: Description 3
  4. Title 4: Description 4`;
  
  return prompt;
}

function createSpikePrompt(data: { unusualTransactions: Transaction[] }): string {
  const { unusualTransactions } = data;
  
  if (unusualTransactions.length === 0) {
        return `Provide 4 general financial tips since there are no unusual transactions to analyze. For each tip:
    1. Short title (max 30 chars)
    2. Brief description (max 200 chars)
    
    Format as:
    1. Title 1: Description 1
    2. Title 2: Description 2
    3. Title 3: Description 3
    4. Title 4: Description 4`;
  }
  
  let prompt = `The user has the following unusual transactions that may require attention:\n\n`;
  
  unusualTransactions.forEach(tx => {
    prompt += `- Date: ${tx.date.toISOString().split('T')[0]}\n`;
    prompt += `  Description: ${tx.wording}\n`;
    prompt += `  Amount: $${Math.abs(tx.value).toFixed(2)}\n`;
    prompt += `  Category: ${tx.category}\n`;
    if (tx.anomalyReason) {
      prompt += `  Reason for flag: ${tx.anomalyReason}\n`;
    }
    prompt += `\n`;
  });
  
  prompt += `Provide 4 specific financial tips regarding these unusual transactions. For each tip:
  1. Short title (max 30 chars)
  2. Brief description (max 200 chars)
  
  Format as:
  1. Title 1: Description 1
  2. Title 2: Description 2
  3. Title 3: Description 3
  4. Title 4: Description 4`;
  
  return prompt;
}
function createDailyInsightPrompt(data: { summary: string }): string {
  return `Based on these monthly transactions:
  
  ${data.summary}
  
  Provide 4 specific financial tips. For each tip:
  1. Short title (max 30 chars)
  2. Brief description (max 200 chars)
  
  Format as:
  1. Title 1: Description 1
  2. Title 2: Description 2
  3. Title 3: Description 3
  4. Title 4: Description 4`;
}



function getFallbackTips(): FinancialTip[] {
  return [
    {
      title: "Fallback Track your expenses",
      description: "Record all spending to identify trends and areas where you can cut back."
    },
    {
      title: "Fallback Build emergency fund",
      description: "Save 3-6 months of expenses for unexpected financial challenges."
    },
    {
      title: "Fallback Reduce dining out",
      description: "Cook more meals at home to save money and improve your health."
    },
    {
      title: "Fallback Review subscriptions",
      description: "Cancel unused subscriptions and services to reduce monthly expenses."
    }
  ];
}

export async function saveFinancialTipsToDatabase(tipType: TipType = TipType.DAILY_INSIGHT) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  
  const tips = await getFinancialTips(tipType);
  
  await prisma.financialTip.deleteMany({
    where: { 
      userId: session.user.id,
      type: tipType
    }
  });
  
  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID is undefined");
  }
  
  const savedTips = await Promise.all(
    tips.map(tip => 
      prisma.financialTip.create({
        data: {
          title: tip.title,
          description: tip.description,
          isLiked: null,
          type: tip.type || tipType,
          userId: userId
        }
      })
    )
  );
  
  return savedTips;
}

export async function getUserFinancialTips(tipType: TipType = TipType.DAILY_INSIGHT) {
  const session = await auth();
  if (!session?.user?.id) {
    return getFallbackTips().map(tip => ({ ...tip, type: tipType }));
  }
  
  const userTips = await prisma.financialTip.findMany({
    where: { 
      userId: session.user.id,
      type: tipType
    },
    orderBy: { createdAt: 'desc' },
    take: 4
  });
  
  if (userTips.length === 0) {
    return saveFinancialTipsToDatabase(tipType);
  }
  
  return userTips;
}

export async function toggleFinancialTipLike(tipId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  
  const tip = await prisma.financialTip.findUnique({
    where: { id: tipId }
  });
  
  if (!tip || tip.userId !== session.user.id) {
    throw new Error("Tip not found or unauthorized");
  }
  
  return prisma.financialTip.update({
    where: { id: tipId },
    data: { isLiked: tip.isLiked === null ? true : !tip.isLiked }
  });
}