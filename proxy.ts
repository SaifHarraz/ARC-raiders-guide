import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { isMaintenanceModeCached } from "@/lib/services/settings-cache";
import { prisma } from "@/lib/prisma";

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
export default auth(async (req) => {
  let isLoggedIn = !!req.auth;
  let isAdmin = req.auth?.user?.role === 'ADMIN';
  let isModerator = req.auth?.user?.role === 'MODERATOR';
  let isStaff = isAdmin || isModerator;
  let isBanned = (req.auth?.user as any)?.banned === true;

  // Validate sessionVersion against the database — the JWT token can be stale
  // (e.g. right after a role change or ban), so we re-check here since this
  // runs in Node.js runtime and can safely query Prisma.
  if (isLoggedIn && req.auth?.user?.id) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: req.auth.user.id },
        select: { sessionVersion: true, role: true, banned: true },
      });

      const tokenSessionVersion = (req.auth.user as any)?.sessionVersion;

      if (
        !dbUser ||
        (typeof tokenSessionVersion === 'number' &&
          dbUser.sessionVersion !== tokenSessionVersion)
      ) {
        // Session is stale (role/ban changed since token was issued) — treat as logged out
        isLoggedIn = false;
        isAdmin = false;
        isModerator = false;
        isStaff = false;
        isBanned = false;
      } else {
        // Use fresh values from the database
        isAdmin = dbUser.role === 'ADMIN';
        isModerator = dbUser.role === 'MODERATOR';
        isStaff = isAdmin || isModerator;
        isBanned = dbUser.banned === true;
      }
    } catch (error) {
      console.error("Failed to validate session version:", error);
      // On DB error, fall back to token data rather than blocking the request
    }
  }

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

  // Redirect authenticated users away from auth pages to home
  // (now uses the DB-validated isLoggedIn, so a stale/invalidated
  // session correctly lets the user reach /login again)
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