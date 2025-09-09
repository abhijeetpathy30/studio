import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const hasProfile = request.cookies.has('rational-religion-profile-complete');
  const isOnboarding = request.nextUrl.pathname.startsWith('/onboarding');

  // In a real app, we would also check if the user is authenticated.
  // For this prototype, we'll rely on a cookie.
 
  if (isOnboarding) {
    // If they finish onboarding, the cookie is set, redirect to home.
    if (hasProfile) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, let them proceed to onboarding.
    return NextResponse.next();
  }
 
  if (!hasProfile) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
