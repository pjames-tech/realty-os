import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-config";
import { leadInclude, prismaLeadToLeadRecord } from "@/lib/db-mappers";

export const runtime = "nodejs";

export async function GET() {
  const agent = await getAdminSession();

  // Build the where clause based on the agent's role
  const where: Record<string, unknown> = {};

  if (agent) {
    if (agent.role === "SOLO_AGENT" || agent.role === "ORG_AGENT") {
      where.agentId = agent.id;
    }
    // ORG_ADMIN and SUPER_ADMIN see all leads
  }

  const prismaLeads = await db.lead.findMany({
    where,
    include: leadInclude,
    orderBy: { updatedAt: "desc" },
  });

  const leads = prismaLeads.map(prismaLeadToLeadRecord);

  return NextResponse.json({ leads });
}
