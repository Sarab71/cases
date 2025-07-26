import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('auth')?.value === 'true';
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url)); // Already logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
