import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CLIENT_SESSION_COOKIE } from "@/lib/auth";
import { readState } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: { identifier?: string };

  try {
    payload = (await request.json()) as { identifier?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const identifier = payload.identifier?.trim().toLowerCase() || "";
  if (!identifier) {
    return NextResponse.json({ error: "Identifier is required" }, { status: 400 });
  }

  const state = await readState();
  const lead = Object.values(state.leads).find((entry) => {
    return (
      entry.email?.toLowerCase() === identifier ||
      entry.phone?.toLowerCase() === identifier
    );
  });

  if (!lead) {
    return NextResponse.json({ error: "No client record found" }, { status: 404 });
  }

  (await cookies()).set(CLIENT_SESSION_COOKIE, lead.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ ok: true });
}
