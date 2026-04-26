import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/admin'];
const authRoutes = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(p => path.startsWith(p)) && !authRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const token = request.cookies.get('admin_token')?.value;
  const session = token ? await decrypt(token) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAuthRoute && session && session.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
