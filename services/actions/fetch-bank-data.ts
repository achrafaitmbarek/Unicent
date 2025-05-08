'use server'

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { storeBankAccounts, storeTransactions } from './store-bank-data';
import { Transaction } from '@/types';



export async function fetchBankAccounts() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const connection = await prisma.bankConnection.findFirst({
      where: {
        userId: user.id,
        accessToken: { not: null }
      },
      orderBy: { lastRefresh: 'desc' }
    });

    if (!connection || !connection.accessToken) {
      throw new Error('No active bank connection found');
    }

    const response = await fetch('https://unicenttest-sandbox.biapi.pro/2.0/users/me/accounts', {
      headers: {
        Authorization: `Bearer ${connection.accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch accounts: ${errorData.error || response.statusText}`);
    }

    const accountData = await response.json();
    if (connection?.id && accountData?.accounts) {
      await storeBankAccounts(connection.id, accountData.accounts);
    }

    await prisma.bankConnection.update({
      where: { id: connection.id },
      data:  { lastRefresh: new Date() }
    });

    return {
      success: true,
      data: accountData,
      connectionId: connection.id
    };
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}


export async function fetchAllTransactions(accountId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const connection = await prisma.bankConnection.findFirst({
      where: {
        userId: user.id,
        accessToken: { not: null }
      },
      orderBy: { lastRefresh: 'desc' }
    });

    if (!connection || !connection.accessToken) {
      throw new Error('No active bank connection found');
    }

    const storedAccount = await prisma.bankAccount.findUnique({
      where: {
        connectionId_id: {
          connectionId: connection.id,
          id: parseInt(accountId, 10)
        }
      }
    });

    if (!storedAccount) {
      throw new Error('Account not found');
    }

    let startDate: Date;
    if (storedAccount.lastSyncedTransactionDate) {
      startDate = new Date(storedAccount.lastSyncedTransactionDate);
      startDate.setDate(startDate.getDate() - 1); 
      console.log(`Using last sync date: ${startDate.toISOString().split('T')[0]} for account ${accountId}`);
    } else {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      console.log(`No previous sync date, using default 3 months for account ${accountId}`);
    }
    
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    
    const url =
            `https://unicenttest-sandbox.biapi.pro/2.0/users/me/accounts/${accountId}/transactions` +
            `?min_date=${fmt(startDate)}` +
            `&max_date=${fmt(today)}` +
            `&limit=1000`;  
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${connection.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    let newTransactionsCount = 0;
    
    if (data.transactions && data.transactions.length > 0) {
      await storeTransactions(storedAccount.pk, data.transactions);
      newTransactionsCount = data.transactions.length;
      
      let latestDate = startDate;
      data.transactions.forEach((tx: Transaction) => {
        const txDate = new Date(tx.date);
        if (txDate > latestDate) {
          latestDate = txDate;
        }
      });
      
      await prisma.bankAccount.update({
        where: { pk: storedAccount.pk },
        data: { lastSyncedTransactionDate: latestDate }
      });
      
      console.log(`Synced ${newTransactionsCount} new transactions for account ${accountId}`);
    } else {
      console.log(`No new transactions found for account ${accountId}`);
    }
    
    return {
      success: true,
      newTransactionsCount,
      transactions: data.transactions || [],
      metadata: {
        first_date: data.first_date,
        last_date: data.last_date,
        total: data.total,
        has_more: !!data._links?.next
      }
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function syncBankData() {
  try {
    const accountsResult = await fetchBankAccounts();
    
    if (!accountsResult.success) {
      return { success: false, error: accountsResult.error || "Failed to fetch accounts" };
    }

    let totalNewTransactions = 0;
    let accountsUpdated = 0;
    
    if (accountsResult.connectionId) {
      const accounts = await prisma.bankAccount.findMany({
        where: {
          connectionId: accountsResult.connectionId
        }
      });
      
      for (const account of accounts) {
        try {
          const result = await fetchAllTransactions(account.id.toString());
          
          if (result.success && (result.newTransactionsCount ?? 0) > 0) {
            totalNewTransactions += result.newTransactionsCount ?? 0;
            accountsUpdated++;
          }
        } catch (err) {
          console.error(`Error fetching transactions for account ${account.id}:`, err);
        }
      }
    }
    
    return { 
      success: true,
      stats: {
        newTransactions: totalNewTransactions,
        accountsUpdated: accountsUpdated,
        lastSynced: new Date()
      }
    };
  } catch (error) {
    console.error("Sync error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error during sync" 
    };
  }
}