import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // Sign in via Supabase Auth
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Look up the agent record linked to this Supabase user
  const agent = await db.agent.findUnique({
    where: { supabaseUserId: data.user.id },
  });

  if (!agent) {
    // Valid Supabase user but no agent record — sign them out
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    name: agent.name,
    role: agent.role,
    email: agent.email,
  });
}
