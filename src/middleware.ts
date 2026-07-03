import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secretKey = getSecretKey();

  if (token && secretKey) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      if (payload.role === 'admin') {
        return NextResponse.next();
      }
    } catch {
      // invalid/expired token, fall through to redirect
    }
  }

  const loginUrl = new URL('/admin', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/backoffice/:path*'],
};
