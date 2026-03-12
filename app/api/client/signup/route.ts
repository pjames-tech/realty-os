import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CLIENT_SESSION_COOKIE } from "@/lib/auth";
import { applyQualificationUpdates, deriveTags } from "@/lib/domain";
import { qualifyLeadMessage } from "@/lib/qualifier";
import {
  appendConversation,
  createLead,
  mutateState,
  trackResponseMetrics,
} from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: {
    name?: string;
    email?: string;
    phone?: string;
    budget?: string;
    location?: string;
    propertyType?: string;
    timeline?: string;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (!payload.email?.trim()) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  const message = [
    payload.name ? `My name is ${payload.name}.` : "",
    payload.budget ? `My budget is ${payload.budget}.` : "",
    payload.location ? `Preferred location is ${payload.location}.` : "",
    payload.propertyType ? `Property type is ${payload.propertyType}.` : "",
    payload.timeline ? `My timeline is ${payload.timeline}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const result = await mutateState(async (state) => {
    let lead = createLead({
      name: payload.name,
      email: payload.email,
      source: "website-onboarding",
    });

    lead = appendConversation(lead, "user", message);

    const decision = await qualifyLeadMessage(lead, message);
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

    return { leadId: lead.id, assistantReply: decision.reply };
  });

  // Set session cookie so user is auto-logged in
  (await cookies()).set(CLIENT_SESSION_COOKIE, result.leadId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true, ...result }, { status: 201 });
}
