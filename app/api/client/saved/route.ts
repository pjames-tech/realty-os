import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientSession } from "@/lib/auth-config";
import { saveSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const lead = await getClientSession();
  if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await db.savedProperty.findMany({
    where: { leadId: lead.id },
    include: {
      property: {
        include: { agent: { select: { id: true, name: true } } },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json({ saved });
}

export async function POST(req: NextRequest) {
  const lead = await getClientSession();
  if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const saved = await db.savedProperty.upsert({
    where: {
      leadId_propertyId: { leadId: lead.id, propertyId: parsed.data.propertyId },
    },
    update: {},
    create: { leadId: lead.id, propertyId: parsed.data.propertyId },
  });

  return NextResponse.json({ saved }, { status: 201 });
}
