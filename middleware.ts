import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply middleware to admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if user has authentication cookie
    const authCookie = request.cookies.get("payload-token");

    if (!authCookie) {
      // Redirect to login if no auth cookie
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If there's an auth cookie, let the request continue
    // Role-based access control is handled by the AdminGuard component
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
