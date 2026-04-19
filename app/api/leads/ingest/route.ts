import { NextRequest, NextResponse } from "next/server";
import { applyQualificationUpdates, deriveTags } from "@/lib/domain";
import { qualifyLeadMessage } from "@/lib/qualifier";
import {
  appendConversation,
  createLead,
  findLeadByEmail,
  persistLeadFromDomain,
  trackResponseMetrics,
  getLeadById,
} from "@/lib/db-helpers";
import { prismaLeadToLeadRecord, leadInclude } from "@/lib/db-mappers";
import { db } from "@/lib/db";
import { ingestSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = ingestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, phone, source, message, agentId } = parsed.data;
  const startTime = Date.now();

  try {
    // ── Lead Deduplication ──
    let prismaLead = email ? await findLeadByEmail(email) : null;
    const isExisting = Boolean(prismaLead);

    if (!prismaLead) {
      prismaLead = await createLead({
        name,
        email,
        phone,
        source,
        agentId,
      });
    } else {
      // Update contact info if provided and missing
      const updates: Record<string, string> = {};
      if (name && !prismaLead.name) updates.name = name;
      if (phone && !prismaLead.phone) updates.phone = phone;
      if (Object.keys(updates).length > 0) {
        await db.lead.update({ where: { id: prismaLead.id }, data: updates });
      }
    }

    // Append user message
    await appendConversation(prismaLead.id, "user", message.trim());

    // Re-fetch lead with all relations for domain logic
    const freshLead = await getLeadById(prismaLead.id);
    if (!freshLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    let leadRecord = prismaLeadToLeadRecord(freshLead);

    // Run AI qualifier (outside transaction — external API call)
    const decision = await qualifyLeadMessage(leadRecord, message.trim());

    // Apply domain logic
    leadRecord = applyQualificationUpdates(
      leadRecord,
      decision.updates,
      decision.confidence,
      decision.action
    );
    leadRecord.tags = deriveTags(leadRecord);

    // Persist assistant reply
    await appendConversation(prismaLead.id, "assistant", decision.reply);

    // Persist domain updates
    await persistLeadFromDomain({ ...leadRecord, id: prismaLead.id });

    // Track metrics
    const responseTimeMs = Date.now() - startTime;
    await trackResponseMetrics(responseTimeMs);

    return NextResponse.json(
      {
        lead: leadRecord,
        assistantReply: decision.reply,
        responseTimeMs,
        deduplicated: isExisting,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Ingest failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
