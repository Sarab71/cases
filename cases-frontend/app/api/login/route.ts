// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (
    username === process.env.USERNAME &&
    password === process.env.PASSWORD
  ) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
}
