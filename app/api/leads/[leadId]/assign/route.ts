import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assignSchema } from "@/lib/validations";
import { getLeadById } from "@/lib/db-helpers";
import { prismaLeadToLeadRecord } from "@/lib/db-mappers";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = assignSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { leadId } = await params;
  const { agentId } = parsed.data;

  try {
    // Verify agent exists
    const agent = await db.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    await db.lead.update({
      where: { id: leadId },
      data: { agentId, updatedAt: new Date() },
    });

    const updatedLead = await getLeadById(leadId);
    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      lead: prismaLeadToLeadRecord(updatedLead),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Assignment failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
