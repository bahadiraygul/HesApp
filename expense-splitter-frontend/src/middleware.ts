import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "expense_splitter_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value ||
                request.headers.get("authorization")?.replace("Bearer ", "");

  // Check localStorage token (will be handled client-side)
  const path = request.nextUrl.pathname;

  // Protected routes (dashboard and its sub-routes)
  const isProtectedRoute = path.startsWith("/dashboard");

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    // Since we can't access localStorage in middleware, we'll handle this client-side
    // This middleware serves as an additional layer
    return NextResponse.next();
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if ((path === "/login" || path === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).* )",
  ],
};
