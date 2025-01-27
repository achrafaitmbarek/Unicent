import { auth } from "@/auth";

import { publicRoutes, authRoutes, protectedRoutes, DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default auth((req) => {
  const url = new URL(req.nextUrl);

  if (req.auth) {
    if ([...publicRoutes, ...authRoutes].includes(url.pathname)) {
      const redirectUrl = new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl.origin);
      return Response.redirect(redirectUrl);
    }
  } else {
    if (protectedRoutes.includes(url.pathname)) {
      const loginUrl = new URL("/auth/login", req.nextUrl.origin);
      return Response.redirect(loginUrl);
    }
    if (![...publicRoutes, ...authRoutes].includes(url.pathname)) {
      const rootUrl = new URL("/auth/login", req.nextUrl.origin);
      return Response.redirect(rootUrl);
    }
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