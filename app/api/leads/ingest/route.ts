import { NextRequest, NextResponse } from "next/server";
import { applyQualificationUpdates, deriveTags } from "@/lib/domain";
import { qualifyLeadMessage } from "@/lib/qualifier";
import {
  appendConversation,
  createLead,
  mutateState,
  trackResponseMetrics
} from "@/lib/store";
import { IngestPayload } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: IngestPayload;
  try {
    payload = (await req.json()) as IngestPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload.message || payload.message.trim().length === 0) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  const result = await mutateState(async (state) => {
    let lead = createLead({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      source: payload.source
    });

    lead = appendConversation(lead, "user", payload.message.trim());

    const decision = await qualifyLeadMessage(lead, payload.message.trim());
    lead = applyQualificationUpdates(
      lead,
      decision.updates,
      decision.confidence,
      decision.action
    );
    lead = appendConversation(lead, "assistant", decision.reply);
    lead.tags = deriveTags(lead);

    state.leads[lead.id] = lead;
    const responseTimeMs = Date.now() - startTime;
    trackResponseMetrics(state, responseTimeMs);

    return {
      lead,
      assistantReply: decision.reply,
      responseTimeMs
    };
  });

  return NextResponse.json(result, { status: 201 });
}
