import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const CLIENT_SESSION_COOKIE = "realtyos_client_session";

// Routes that don't require any authentication
const PUBLIC_ROUTES = new Set([
  "/",
  "/about",
  "/careers",
  "/privacy",
  "/terms",
  "/help",
  "/contact",
  "/getting-started",
  "/tutorials",
  "/demo",
  "/community",
  "/automations",
  "/docs",
  "/inquiry",
]);

const PUBLIC_API_ROUTES = new Set([
  "/api/health",
  "/api/sloane/chat",
  "/api/leads/ingest",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/client/login",
  "/api/client/signup",
  "/api/client/logout",
  "/api/super-admin/login",
  "/api/super-admin/logout",
  "/api/agents/invite/validate",
  "/api/contact",
  "/api/properties",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public pages
  if (PUBLIC_ROUTES.has(pathname)) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  // Skip public API routes
  if (PUBLIC_API_ROUTES.has(pathname)) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  // ─── Admin / Agent pages ─────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/register") {
    const { user, supabaseResponse } = await updateSession(request);
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // ─── Agent pages ─────────────────────────────────────
  if (pathname.startsWith("/agent")) {
    const { user, supabaseResponse } = await updateSession(request);
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // ─── Super Admin pages ──────────────────────────────
  if (pathname.startsWith("/super-admin") && pathname !== "/super-admin/login") {
    const { user, supabaseResponse } = await updateSession(request);
    if (!user) {
      return NextResponse.redirect(new URL("/super-admin/login", request.url));
    }
    return supabaseResponse;
  }

  // ─── Client Portal pages ────────────────────────────
  if (pathname.startsWith("/portal") && pathname !== "/portal/login") {
    const { supabaseResponse } = await updateSession(request);
    const clientCookie = request.cookies.get(CLIENT_SESSION_COOKIE);
    if (!clientCookie?.value) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
    return supabaseResponse;
  }

  // ─── API routes requiring admin auth ─────────────────
  if (
    pathname.startsWith("/api/leads") ||
    pathname.startsWith("/api/agents") ||
    pathname.startsWith("/api/metrics") ||
    pathname.startsWith("/api/messages")
  ) {
    // /api/leads/ingest is public (already handled above)
    const { user, supabaseResponse } = await updateSession(request);
    if (!user) {
      // Check if this is a client-scoped route
      const clientCookie = request.cookies.get(CLIENT_SESSION_COOKIE);
      if (!clientCookie?.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return supabaseResponse;
  }

  // ─── API routes requiring client auth ────────────────
  if (pathname.startsWith("/api/client")) {
    const { supabaseResponse } = await updateSession(request);
    const clientCookie = request.cookies.get(CLIENT_SESSION_COOKIE);
    if (!clientCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return supabaseResponse;
  }

  // ─── Super admin API routes ──────────────────────────
  if (pathname.startsWith("/api/super-admin")) {
    const { user, supabaseResponse } = await updateSession(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return supabaseResponse;
  }

  // Default: refresh session
  const { supabaseResponse } = await updateSession(request);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
