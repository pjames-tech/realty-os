import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token parameter." }, { status: 400 });
  }

  try {
    const invite = await db.invitation.findUnique({
      where: { token },
    });

    if (!invite || invite.usedAt) {
      return NextResponse.json(
        { error: "Invalid or expired invitation." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      invite: {
        token: invite.token,
        email: invite.email,
        organizationName: invite.organizationName,
        createdAt: invite.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Validation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
