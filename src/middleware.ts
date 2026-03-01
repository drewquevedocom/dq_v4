import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

const isLoginRoute = (pathname: string) => pathname === "/api/admin/auth/login";
const isProtectedDashboardRoute = (pathname: string) =>
  pathname.startsWith("/dashboard") || pathname.startsWith("/admin/mission-control");
const isProtectedAdminApiRoute = (pathname: string) => pathname.startsWith("/api/admin/");

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isLoginRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  if (session) {
    return NextResponse.next();
  }

  if (isProtectedAdminApiRoute(pathname)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProtectedDashboardRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin";
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/mission-control/:path*", "/api/admin/:path*"],
};
