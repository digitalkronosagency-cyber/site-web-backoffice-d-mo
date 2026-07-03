import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }) };
  }
  return { session, response: null };
}
