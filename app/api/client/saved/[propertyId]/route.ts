import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientSession } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  const lead = await getClientSession();
  if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { propertyId } = await params;
  await db.savedProperty.deleteMany({
    where: { leadId: lead.id, propertyId },
  });

  return NextResponse.json({ ok: true });
}
