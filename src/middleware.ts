import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const hasProfile = request.cookies.has('rational-religion-profile-complete');
  const isOnboarding = request.nextUrl.pathname.startsWith('/onboarding');
 
  if (isOnboarding) {
    if (hasProfile) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
 
  if (!isOnboarding && !hasProfile) {
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
     * - onboarding (the onboarding page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
