import { auth } from "@/lib/auth-config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // Only admin role can access admin panel
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect company routes (except login)
  if (pathname.startsWith("/company") && !pathname.startsWith("/company/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/company/login", req.url));
    }
    // Only operator or admin can access company panel
    if (userRole !== "operator" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/company/:path*", "/api/admin/:path*"],
};
