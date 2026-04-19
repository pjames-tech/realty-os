import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientSession } from "@/lib/auth-config";
import { tourCreateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const lead = await getClientSession();
  if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tours = await db.tour.findMany({
    where: { leadId: lead.id },
    include: {
      property: {
        include: { agent: { select: { id: true, name: true } } },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json({ tours });
}

export async function POST(req: NextRequest) {
  const lead = await getClientSession();
  if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = tourCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const tour = await db.tour.create({
    data: {
      leadId: lead.id,
      propertyId: parsed.data.propertyId,
      scheduledAt: new Date(parsed.data.scheduledAt),
      type: parsed.data.type,
      notes: parsed.data.notes,
    },
    include: { property: true },
  });

  return NextResponse.json({ tour }, { status: 201 });
}
