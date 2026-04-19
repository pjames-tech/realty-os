import { NextResponse } from "next/server";
import { signOutClient } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function POST() {
  await signOutClient();
  return NextResponse.json({ ok: true });
}
