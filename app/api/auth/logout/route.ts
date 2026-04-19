import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signOutClient } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
  // Sign out of Supabase (admin/agent session)
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Also clear client session cookie
  await signOutClient();

  return NextResponse.json({ ok: true, message: "Logged out successfully" });
}
