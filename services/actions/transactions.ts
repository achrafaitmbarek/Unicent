"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TransactionCategory } from "@prisma/client";

export async function getRecentTransactions(limit = 6) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          connection: {
            user: {
              email: session.user.email
            }
          }
        }
      },
      include: {
        account: {
          select: {
            name: true,
            currencySymbol: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    });

    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

export async function getIncomeTransactions(limit = 30) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        flow: 'INCOME',
        account: {
          connection: {
            user: {
              email: session.user.email
            }
          }
        }
      },
      include: {
        account: {
          select: {
            name: true,
            currencySymbol: true,
            number: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    });

    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching income transactions:", error);
    return { success: false, error: "Failed to fetch income transactions" };
  }
}

export async function getSpendingTransactions(limit = 30) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        flow: 'EXPENSE',  
        account: {
          connection: {
            user: {
              email: session.user.email
            }
          }
        }
      },
      include: {
        account: {
          select: {
            name: true,
            currencySymbol: true,
            number: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    });

    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching spending transactions:", error);
    return { success: false, error: "Failed to fetch spending transactions" };
  }
}

export async function updateTransactionCategory(
  transactionId: string,
  category: string
) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Authentication required')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  
  if (!user) {
    throw new Error('User not found')
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      pk: transactionId,
      account: {
        connection: {
          userId: user.id
        }
      }
    }
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  await prisma.transaction.update({
    where: { pk: transactionId },
    data: { 
      category: category as TransactionCategory,
      updatedAt: new Date()
    }
  })

  revalidatePath('/dashboard/analytics')
  revalidatePath('/dashboard/analytics/incomes')
  revalidatePath('/dashboard/analytics/spendings')
  
  return { success: true }
}

