import { NextRequest, NextResponse } from "next/server";
import { markLeadBooked } from "@/lib/booking";
import { applyQualificationUpdates, deriveTags } from "@/lib/domain";
import { qualifyLeadMessage } from "@/lib/qualifier";
import {
  appendConversation,
  mutateState,
  trackResponseMetrics
} from "@/lib/store";
import { LeadMessagePayload } from "@/lib/types";

export const runtime = "nodejs";

type Context = {
  params: { leadId: string };
};

export async function POST(req: NextRequest, context: Context) {
  let payload: LeadMessagePayload;
  try {
    payload = (await req.json()) as LeadMessagePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload.message || payload.message.trim().length === 0) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  const { leadId } = context.params;
  const startTime = Date.now();

  const result = await mutateState(async (state) => {
    const existing = state.leads[leadId];
    if (!existing) {
      return null;
    }

    let lead = appendConversation(existing, "user", payload.message.trim());
    const decision = await qualifyLeadMessage(lead, payload.message.trim());
    lead = applyQualificationUpdates(
      lead,
      decision.updates,
      decision.confidence,
      decision.action
    );

    if (decision.action === "book") {
      lead = markLeadBooked(lead);
    }

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

  if (!result) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
