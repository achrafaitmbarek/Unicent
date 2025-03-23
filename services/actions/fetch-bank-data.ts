'use server'

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';


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

    await prisma.bankConnection.update({
      where: { id: connection.id },
      data: { lastRefresh: new Date() }
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


export async function fetchAllTransactions(accountId: string , limit: number) {
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

    const url = `https://unicenttest-sandbox.biapi.pro/2.0/users/me/accounts/${accountId}/transactions/?limit=${limit}`;
    
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
    
    return {
      success: true,
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