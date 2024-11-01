import { auth } from "@/auth";

export default auth((req) => {
  const url = new URL(req.nextUrl);

  if (req.auth) {
    // If authenticated and accessing the root, redirect to /dashboard
    if (url.pathname === "/" || url.pathname === "/auth/login") {
      const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
      return Response.redirect(dashboardUrl);
    }
  } else {
    // If not authenticated and accessing /dashboard, redirect to /auth/login
    if (url.pathname === "/dashboard") {
      const loginUrl = new URL("/auth/login", req.nextUrl.origin);
      return Response.redirect(loginUrl);
    }

    // If not authenticated and accessing any other path except root and /auth/login, redirect to the root
    if (url.pathname !== "/" && url.pathname !== "/auth/login") {
      const rootUrl = new URL("/", req.nextUrl.origin);
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