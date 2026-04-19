import { NextRequest, NextResponse } from "next/server";
import { applyQualificationUpdates, deriveTags } from "@/lib/domain";
import { qualifyLeadMessage } from "@/lib/qualifier";
import {
  createLead,
  appendConversation,
  persistLeadFromDomain,
  trackResponseMetrics,
} from "@/lib/db-helpers";
import { prismaLeadToLeadRecord } from "@/lib/db-mappers";
import { setClientSession } from "@/lib/auth-config";
import { clientSignupSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = clientSignupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, phone, password, budget, location, propertyType, timeline, agentId } =
    parsed.data;

  const startTime = Date.now();

  // Build the initial message from form fields
  const message = [
    name ? `My name is ${name}.` : "",
    budget ? `My budget is ${budget}.` : "",
    location ? `Preferred location is ${location}.` : "",
    propertyType ? `Property type is ${propertyType}.` : "",
    timeline ? `My timeline is ${timeline}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  try {
    // Create the lead in the database with hashed password
    const prismaLead = await createLead({
      name,
      email,
      phone,
      source: "website-onboarding",
      password,
      agentId,
    });

    // Append the user's message
    await appendConversation(prismaLead.id, "user", message);

    // Run the AI qualifier (outside transaction — external API call)
    let leadRecord = prismaLeadToLeadRecord(prismaLead);
    // Add the user message to the in-memory record for the qualifier
    leadRecord.conversation = [
      ...leadRecord.conversation,
      { id: "temp", role: "user", content: message, timestamp: new Date().toISOString() },
    ];

    const decision = await qualifyLeadMessage(leadRecord, message);

    // Apply domain logic
    leadRecord = applyQualificationUpdates(
      leadRecord,
      decision.updates,
      decision.confidence,
      decision.action
    );
    leadRecord.tags = deriveTags(leadRecord);

    // Persist the assistant's reply
    await appendConversation(prismaLead.id, "assistant", decision.reply);

    // Persist domain updates back to DB
    await persistLeadFromDomain({ ...leadRecord, id: prismaLead.id });

    // Track metrics
    const responseTimeMs = Date.now() - startTime;
    await trackResponseMetrics(responseTimeMs);

    // Set client session cookie
    await setClientSession(prismaLead.id);

    return NextResponse.json(
      { ok: true, leadId: prismaLead.id, assistantReply: decision.reply },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message2 = error instanceof Error ? error.message : "Signup failed";
    return NextResponse.json({ error: message2 }, { status: 500 });
  }
}
