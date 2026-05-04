import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAgent } from "@/lib/db-helpers";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, password, role, organizationName } = parsed.data;

  // Check if email already exists
  const existing = await db.agent.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  try {
    // Create Supabase Auth user via admin API (bypasses rate limits + email confirmation)
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabaseAdmin = createAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Registration failed" },
        { status: 500 }
      );
    }

    // Create agent record linked to Supabase user
    const agent = await createAgent({
      name,
      email,
      password,
      role,
      organizationName,
      supabaseUserId: authData.user.id,
    });

    return NextResponse.json({
      ok: true,
      agent: { id: agent.id, email: agent.email },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
