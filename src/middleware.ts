import { NextResponse } from 'next/server';

// This middleware is primarily for logging and can be extended for server-side auth
// Currently, client-side protection is handled by ProtectedRoute component and AuthContext
export function middleware() {
  // You can add additional middleware logic here
  // For example: logging, analytics, etc.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
