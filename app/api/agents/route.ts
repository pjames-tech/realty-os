import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function GET() {
  const agent = await getAdminSession();
  if (!agent) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let where: Record<string, unknown> = {};

  if (agent.role === "ORG_ADMIN" && agent.organizationName) {
    where = { organizationName: agent.organizationName };
  } else if (agent.role === "SOLO_AGENT" || agent.role === "ORG_AGENT") {
    where = { id: agent.id };
  }
  // SUPER_ADMIN sees all agents

  const agents = await db.agent.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      organizationName: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ agents });
}
