import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { publicRoutes, authRoutes, protectedRoutes, DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default auth(async (req) => {
  const url = new URL(req.nextUrl);
  const path = url.pathname;

  // Check if the path is in public routes - allow access
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Helper function to check if a path matches a protected route pattern
  const isProtectedPath = (path: string): boolean => {
    return protectedRoutes.some(route => {
      if (route.endsWith('/*')) {
        const baseRoute = route.slice(0, -2);
        return path === baseRoute || path.startsWith(`${baseRoute}/`);
      }
      return path === route;
    });
  };

  if (req.auth) {
    // User is logged in
    if (authRoutes.includes(path)) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl.origin));
    }
    return NextResponse.next();
  } else {
    // User is not logged in
    if (isProtectedPath(path)) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - api auth routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/auth/).*)',
  ]
};