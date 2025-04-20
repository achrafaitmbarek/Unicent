import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import powensClient from '@/lib/powens';
import { fetchAllTransactions, fetchBankAccounts } from '@/services/actions/fetch-bank-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const connectionId = searchParams.get('connection_id');
  
  if (!code || !connectionId) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_params', request.url));
  }
  
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/dashboard?error=user_not_found', request.url));
    }

    const tokenResponse = await powensClient.exchangeAuthorizationCode(code);

   await prisma.bankConnection.upsert({
      where: {
        userId_providerId: {
          userId: user.id,
          providerId: connectionId
        }
      },
      update: {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || null,
        expiresAt: tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000) : null,
        lastRefresh: new Date()
      },
      create: {
        userId: user.id,
        providerId: connectionId,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || null,
        expiresAt: tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000) : null,
        lastRefresh: new Date()
      }
    });

    try {
      console.log('Fetching accounts...');
      const accountsResult = await fetchBankAccounts();
      
      if (accountsResult.success && accountsResult.connectionId) {
        const accounts = await prisma.bankAccount.findMany({
          where: {
            connectionId: accountsResult.connectionId
          }
        });
        
        console.log(`Found ${accounts.length} accounts to fetch transactions for`);
        
        for (const account of accounts) {
          try {
            console.log(`Fetching transactions for account ${account.name || ''} (ID: ${account.id})`);
            
            await fetchAllTransactions(account.id.toString(), 50);
            
            console.log(`Successfully fetched transactions for account ${account.id}`);
          } catch (txError) {
            console.error(`Error fetching transactions for account ${account.id}:`, txError);
          }
        }
      } else {
        console.error("Failed to fetch accounts or no connection ID returned");
      }
    } catch (fetchError) {
      console.error("Error in data synchronization:", fetchError);
    }

    return NextResponse.redirect(new URL('/dashboard/analytics?success=true', request.url));
  } catch (error) {
    console.error('Error in callback handler:', error);
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent((error as Error).message)}`, request.url));
  }
}