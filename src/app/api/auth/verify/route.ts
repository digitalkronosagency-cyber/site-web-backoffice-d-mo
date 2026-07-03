import { NextResponse } from 'next/server';
import { consumeLoginToken } from '@/lib/magic-link';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/admin?error=expired', origin));
  }

  const email = await consumeLoginToken(token);

  if (!email) {
    return NextResponse.redirect(new URL('/admin?error=expired', origin));
  }

  const sessionToken = await createSessionToken(email);
  const response = NextResponse.redirect(new URL('/backoffice', origin));
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, SESSION_COOKIE_OPTIONS);

  return response;
}
