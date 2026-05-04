import { NextRequest, NextResponse } from "next/server";
import { requireClient, AuthError } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { appendAgentMessage } from "@/lib/db-helpers";
import type { AgentMessage } from "@prisma/client";

export const runtime = "nodejs";

// GET all messages for the client
export async function GET(_request: NextRequest) {
  try {
    const lead = await requireClient();

    const messages = await db.agentMessage.findMany({
      where: { leadId: lead.id },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({
      messages: messages.map((m: AgentMessage) => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST a message from client to agent
export async function POST(request: NextRequest) {
  try {
    const lead = await requireClient();

    let payload: { content?: string };
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const content = payload.content?.trim();
    if (!content) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    await appendAgentMessage(lead.id, "client", content);

    const messages = await db.agentMessage.findMany({
      where: { leadId: lead.id },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({
      ok: true,
      messages: messages.map((m: AgentMessage) => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
