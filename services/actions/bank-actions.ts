'use server'

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import powensClient from '@/lib/powens';

export async function initiateConnection() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Authentication required');
  }

  return powensClient.getConnectUrl();
}

export async function processCallback(code: string, connectionId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error('User not found');
  }

  try {
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

    return { success: true };
  } catch (error) {
    console.error('Error processing callback:', error);
    return { success: false, error: (error as Error).message };
  }
}

