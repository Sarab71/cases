// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie
  response.cookies.set('auth', '', {
    path: '/',
    expires: new Date(0), // Expire the cookie
  });

  return response;
}
