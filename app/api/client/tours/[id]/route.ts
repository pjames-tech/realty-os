import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientSession } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const lead = await getClientSession();
  if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const tour = await db.tour.findUnique({ where: { id } });
  if (!tour || tour.leadId !== lead.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.tour.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ ok: true });
}
