import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appendAgentMessage, getLeadById } from "@/lib/db-helpers";
import { prismaLeadToLeadRecord } from "@/lib/db-mappers";
import { getClientSession } from "@/lib/auth-config";
import { sendMessageSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = sendMessageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { leadId, content, sender } = parsed.data;

  // Security check: if sender is client, ensure they are logged in as that lead
  if (sender === "client") {
    const clientLead = await getClientSession();
    if (!clientLead || clientLead.id !== leadId) {
      return NextResponse.json({ error: "Unauthorized client session" }, { status: 401 });
    }
  }

  try {
    await appendAgentMessage(leadId, sender, content);

    const updatedLead = await getLeadById(leadId);
    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ok: true, lead: prismaLeadToLeadRecord(updatedLead) },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Send failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
