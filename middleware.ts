import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  CLIENT_SESSION_COOKIE,
  isValidAdminSession
} from "@/lib/auth";

function isProtectedAdminPage(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

function isProtectedAdminApi(pathname: string): boolean {
  if (pathname === "/api/leads" || pathname === "/api/metrics") {
    return true;
  }

  return /^\/api\/leads\/[^/]+\/(message|book)$/.test(pathname);
}

function isProtectedClientPage(pathname: string): boolean {
  return pathname.startsWith("/portal") && pathname !== "/portal/login";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const clientToken = request.cookies.get(CLIENT_SESSION_COOKIE)?.value;
  const authenticated = isValidAdminSession(adminToken);

  if (pathname === "/admin/login" && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname === "/portal/login" && clientToken) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (
    !isProtectedAdminPage(pathname) &&
    !isProtectedAdminApi(pathname) &&
    !isProtectedClientPage(pathname)
  ) {
    return NextResponse.next();
  }

  if (isProtectedClientPage(pathname)) {
    if (clientToken) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  if (authenticated) {
    return NextResponse.next();
  }

  if (isProtectedAdminApi(pathname)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
    "/api/leads",
    "/api/leads/:path*",
    "/api/metrics"
  ]
};
