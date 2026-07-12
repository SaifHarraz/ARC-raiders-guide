import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { isMaintenanceModeCached } from "@/lib/services/settings-cache";

// Routes that bypass maintenance mode check
const maintenanceBypassRoutes = [
  "/maintenance",
  "/admin",
  "/api",
  "/login",
  "/register",
  "/banned",
  "/unauthorized",
  "/_next",
  "/favicon",
];

// Proxy middleware for authentication (Next.js 16+)
// Runs in Node.js runtime, so Prisma is supported
// Note: `auth` here already runs the DB-validated session() callback from lib/auth.ts,
// which sets session.user to undefined if sessionVersion is stale, the user is banned,
// or the user no longer exists. So req.auth (the session object) can still be truthy
// even when the user is effectively logged out — always check req.auth?.user, not
// just req.auth, to correctly detect an invalidated session.
export default auth(async (req) => {
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.role === 'ADMIN';
  const isModerator = req.auth?.user?.role === 'MODERATOR';
  const isStaff = isAdmin || isModerator;
  const isBanned = (req.auth?.user as any)?.banned === true;

  const { pathname } = req.nextUrl;

  // Check maintenance mode (skip for bypass routes)
  const shouldCheckMaintenance = !maintenanceBypassRoutes.some(route =>
    pathname.startsWith(route)
  );
  if (shouldCheckMaintenance && !isAdmin) {
    try {
      const maintenanceEnabled = await isMaintenanceModeCached();
      if (maintenanceEnabled) {
        return NextResponse.redirect(new URL("/maintenance", req.url));
      }
    } catch (error) {
      console.error("Failed to check maintenance mode:", error);
    }
  }

  const isProtectedRoute = pathname.startsWith("/dashboard") ||
                          pathname.startsWith("/events") ||
                          pathname.startsWith("/profile");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/login") ||
                     pathname.startsWith("/register");
  const isBannedRoute = pathname.startsWith("/banned");
  const isMaintenanceRoute = pathname.startsWith("/maintenance");

  if (isLoggedIn && isBanned && !isBannedRoute) {
    return NextResponse.redirect(new URL("/banned", req.url));
  }

  if (isBannedRoute && (!isLoggedIn || !isBanned)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminRoute && !isStaff) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to home.
  // Now correctly uses req.auth?.user, so an invalidated session
  // (stale sessionVersion, banned, or deleted user) lets them reach /login again.
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isMaintenanceRoute && !isAdmin) {
    try {
      const maintenanceEnabled = await isMaintenanceModeCached();
      if (!maintenanceEnabled) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};