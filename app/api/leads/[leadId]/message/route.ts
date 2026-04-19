import { NextRequest, NextResponse } from "next/server";
import { markLeadBooked } from "@/lib/booking";
import { applyQualificationUpdates, deriveTags } from "@/lib/domain";
import { qualifyLeadMessage } from "@/lib/qualifier";
import {
  appendConversation,
  getLeadById,
  persistLeadFromDomain,
  trackResponseMetrics,
} from "@/lib/db-helpers";
import { prismaLeadToLeadRecord } from "@/lib/db-mappers";
import { messageSchema } from "@/lib/validations";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ leadId: string }>;
};

export async function POST(req: NextRequest, context: Context) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { leadId } = await context.params;
  const { message } = parsed.data;
  const startTime = Date.now();

  const prismaLead = await getLeadById(leadId);
  if (!prismaLead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Append user message
  await appendConversation(leadId, "user", message.trim());

  // Convert to domain type for qualifier
  let leadRecord = prismaLeadToLeadRecord(prismaLead);
  // Add the message we just appended to the in-memory record
  leadRecord.conversation = [
    ...leadRecord.conversation,
    { id: "temp", role: "user", content: message.trim(), timestamp: new Date().toISOString() },
  ];

  // Run AI qualifier (outside transaction)
  const decision = await qualifyLeadMessage(leadRecord, message.trim());

  // Apply domain logic
  leadRecord = applyQualificationUpdates(
    leadRecord,
    decision.updates,
    decision.confidence,
    decision.action
  );

  if (decision.action === "book") {
    leadRecord = markLeadBooked(leadRecord);
  }

  leadRecord.tags = deriveTags(leadRecord);

  // Persist assistant reply
  await appendConversation(leadId, "assistant", decision.reply);

  // Persist domain updates
  await persistLeadFromDomain({ ...leadRecord, id: leadId });

  // Track metrics
  const responseTimeMs = Date.now() - startTime;
  await trackResponseMetrics(responseTimeMs);

  return NextResponse.json({
    lead: leadRecord,
    assistantReply: decision.reply,
    responseTimeMs,
  });
}
