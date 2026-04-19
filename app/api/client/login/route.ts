import { NextRequest, NextResponse } from "next/server";
import { signInClient } from "@/lib/auth-config";
import { clientLoginSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = clientLoginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const lead = await signInClient(email, password);

  if (!lead) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
