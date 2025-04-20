'use server'

import { auth } from '@/auth';
import powensClient from '@/lib/powens';

export async function initiateConnection() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Authentication required');
  }

  return powensClient.getConnectUrl();
}


