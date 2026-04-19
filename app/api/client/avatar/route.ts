import { NextRequest, NextResponse } from "next/server";
import { requireClient, AuthError } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { avatarSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const lead = await requireClient();

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = avatarSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await db.lead.update({
      where: { id: lead.id },
      data: { avatar: parsed.data.avatar },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
