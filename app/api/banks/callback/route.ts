import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import powensClient from '@/lib/powens';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const connectionId = searchParams.get('connection_id');
  
  if (!code || !connectionId) {
    return NextResponse.redirect(new URL('/dashboard/test?error=missing_params', request.url));
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
      return NextResponse.redirect(new URL('/dashboard/test?error=user_not_found', request.url));
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

    return NextResponse.redirect(new URL('/dashboard/test?success=connected', request.url));
  } catch (error) {
    console.error('Error in callback handler:', error);
    return NextResponse.redirect(new URL(`/dashboard/test?error=${encodeURIComponent((error as Error).message)}`, request.url));
  }
}