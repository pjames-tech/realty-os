import { NextRequest, NextResponse } from "next/server";
import { markLeadBooked } from "@/lib/booking";
import { deriveTags } from "@/lib/domain";
import { getLeadById, persistLeadFromDomain } from "@/lib/db-helpers";
import { prismaLeadToLeadRecord } from "@/lib/db-mappers";
import { bookingSchema } from "@/lib/validations";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ leadId: string }>;
};

export async function POST(req: NextRequest, context: Context) {
  let payload: unknown = {};
  try {
    payload = await req.json();
  } catch {
    payload = {};
  }

  const parsed = bookingSchema.safeParse(payload);
  const slot = parsed.success ? parsed.data.slot : undefined;

  const { leadId } = await context.params;

  const prismaLead = await getLeadById(leadId);
  if (!prismaLead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let leadRecord = prismaLeadToLeadRecord(prismaLead);
  leadRecord = markLeadBooked(leadRecord, slot);
  leadRecord.tags = deriveTags(leadRecord);

  await persistLeadFromDomain({ ...leadRecord, id: leadId });

  return NextResponse.json({ lead: leadRecord });
}
