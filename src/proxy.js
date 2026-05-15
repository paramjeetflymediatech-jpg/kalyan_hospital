import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kalyan-robotic-hospital-secret-key-2026'
);

export async function proxy(request) {
  const token = request.cookies.get('admin_session')?.value;
  
  const isLoginPage = request.nextUrl.pathname === '/admin/login';  
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPage && !isLoginPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isLoginPage && token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (err) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
