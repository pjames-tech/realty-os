import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-config";
import { inviteSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const agent = await getAdminSession();

  if (!agent || agent.role !== "ORG_ADMIN" || !agent.organizationName) {
    return NextResponse.json(
      { error: "Unauthorized or missing organization" },
      { status: 403 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = inviteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email: inviteEmail } = parsed.data;

  try {
    const token =
      Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    await db.invitation.create({
      data: {
        token,
        email: inviteEmail.trim(),
        organizationName: agent.organizationName,
        invitedById: agent.id,
      },
    });

    const inviteLink = `/admin/register?token=${token}`;

    return NextResponse.json({
      ok: true,
      inviteLink,
      message: `Invite generated! In production, an email would be sent to ${inviteEmail}.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Invite failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
