import OpenAI from "openai";
import { computeMissingFields } from "@/lib/domain";
import {
  LeadRecord,
  QualificationDecision,
  QualificationState
} from "@/lib/types";

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const HAS_OPENAI_KEY = Boolean(process.env.OPENAI_API_KEY);

const openai = HAS_OPENAI_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

interface OpenAIDecision {
  reply: string;
  updates: Partial<QualificationState>;
  confidence: number;
  action: "reply" | "book" | "disqualify";
}

export async function qualifyLeadMessage(
  lead: LeadRecord,
  message: string
): Promise<QualificationDecision> {
  if (!openai) {
    return localFallbackDecision(lead, message);
  }

  try {
    const systemPrompt = buildSystemPrompt(lead);
    const response = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: {
        type: "json_object"
      },
      messages: buildOpenAIMessages(lead, systemPrompt)
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return localFallbackDecision(lead, message);
    }

    const parsed = JSON.parse(content) as OpenAIDecision;
    return normalizeDecision(lead, parsed);
  } catch {
    return localFallbackDecision(lead, message);
  }
}

function buildSystemPrompt(lead: LeadRecord): string {
  return [
    "You are RealtyOS Auto-Qualifier for real estate leads.",
    "Respond ONLY with JSON:",
    '{ "reply": string, "updates": { "budget"?: string, "timeline"?: string, "location"?: string, "propertyType"?: string }, "confidence": number, "action": "reply" | "book" | "disqualify" }',
    "Rules:",
    "1) Keep reply under 2 short sentences.",
    "2) Gather budget, timeline, location, propertyType.",
    "3) Use the recent conversation context, especially the last assistant question, before interpreting short user replies like yes or no.",
    "4) Ask for one missing field at a time.",
    "5) If all fields are known and the user confirms booking intent, set action='book'.",
    "6) If the user declines booking with a simple no, do not disqualify them. Keep them qualified and reply politely.",
    "7) Only set action='disqualify' when the user clearly opts out or is not interested in continuing.",
    `Current qualification state: ${JSON.stringify(lead.qualification)}`,
    `Conversation count: ${lead.conversation.length}`
  ].join("\n");
}

function buildOpenAIMessages(
  lead: LeadRecord,
  systemPrompt: string
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const recentConversation = lead.conversation.slice(-8).map((entry) => ({
    role: entry.role,
    content: entry.content
  }));

  return [
    {
      role: "system",
      content: systemPrompt
    },
    ...recentConversation
  ];
}

function normalizeDecision(
  lead: LeadRecord,
  decision: Partial<OpenAIDecision>
): QualificationDecision {
  const updates = sanitizeUpdates(decision.updates || {});
  const merged = { ...lead.qualification, ...updates };
  const missing = computeMissingFields(merged);
  const latestUserMessage = getLatestUserMessage(lead);
  const bookingContext = isBookingContext(lead);
  const affirmativeBookingReply =
    missing.length === 0 && bookingContext && wantsToBook(latestUserMessage);
  const bookingDeclined = bookingContext && isNegativeReply(latestUserMessage);

  let action: "reply" | "book" | "disqualify" =
    decision.action === "book" || decision.action === "disqualify"
      ? decision.action
      : "reply";

  if (affirmativeBookingReply) {
    action = "book";
  }

  if (bookingDeclined) {
    action = "reply";
  }

  if (action === "disqualify" && bookingDeclined) {
    action = "reply";
  }

  let reply =
    typeof decision.reply === "string" && decision.reply.trim().length > 0
      ? decision.reply.trim()
      : fallbackQuestion(missing[0]);

  if (affirmativeBookingReply) {
    reply =
      "Perfect. I am booking your 15-minute strategy call now and will attach the calendar link.";
  } else if (bookingDeclined) {
    reply =
      "No problem. I will keep your details qualified, and you can book whenever you're ready.";
  }

  const confidence =
    typeof decision.confidence === "number"
      ? clamp(decision.confidence)
      : inferConfidence(missing.length);

  return {
    reply,
    updates: { ...updates, missingFields: missing },
    confidence,
    action
  };
}

function localFallbackDecision(
  lead: LeadRecord,
  message: string
): QualificationDecision {
  const updates: Partial<QualificationState> = {
    budget: lead.qualification.budget || extractBudget(message),
    timeline: lead.qualification.timeline || extractTimeline(message),
    location: lead.qualification.location || extractLocation(message),
    propertyType:
      lead.qualification.propertyType || extractPropertyType(message)
  };

  const merged = { ...lead.qualification, ...sanitizeUpdates(updates) };
  const missing = computeMissingFields(merged);
  const bookingContext = isBookingContext(lead);
  const bookingDeclined = bookingContext && isNegativeReply(message);

  if (wantsToStop(message)) {
    return {
      reply: "Understood. I will close this inquiry for now.",
      updates: { missingFields: missing },
      confidence: 0.2,
      action: "disqualify"
    };
  }

  if (missing.length === 0 && wantsToBook(message)) {
    return {
      reply:
        "Perfect, I can book your 15-minute strategy call now. I am locking in the earliest slot.",
      updates: { ...sanitizeUpdates(updates), missingFields: missing },
      confidence: 0.95,
      action: "book"
    };
  }

  if (bookingDeclined) {
    return {
      reply:
        "No problem. I will keep your details on file, and you can book the strategy call whenever you're ready.",
      updates: { ...sanitizeUpdates(updates), missingFields: missing },
      confidence: 0.9,
      action: "reply"
    };
  }

  if (missing.length === 0) {
    return {
      reply:
        "Great, I have everything I need. Do you want me to book a 15-minute strategy call?",
      updates: { ...sanitizeUpdates(updates), missingFields: missing },
      confidence: 0.9,
      action: "reply"
    };
  }

  return {
    reply: fallbackQuestion(missing[0]),
    updates: { ...sanitizeUpdates(updates), missingFields: missing },
    confidence: inferConfidence(missing.length),
    action: "reply"
  };
}

function sanitizeUpdates(
  updates: Partial<QualificationState>
): Partial<QualificationState> {
  const cleaned: Partial<QualificationState> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim().length === 0) continue;
    (cleaned as Record<string, unknown>)[key] = value;
  }
  return cleaned;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function inferConfidence(missingCount: number): number {
  return clamp(1 - missingCount * 0.2);
}

function fallbackQuestion(field?: string): string {
  switch (field) {
    case "budget":
      return "What budget range are you targeting?";
    case "timeline":
      return "When are you planning to move or invest?";
    case "location":
      return "Which location are you focused on?";
    case "propertyType":
      return "What type of property are you looking for?";
    default:
      return "Can you share one more detail so I can qualify this quickly?";
  }
}

function extractBudget(input: string): string | undefined {
  const match = input.match(
    /\$?\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million)?(?:\s*-\s*\$?\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million)?)?/i
  );
  return match?.[0]?.trim();
}

function extractTimeline(input: string): string | undefined {
  const match = input.match(
    /\b(asap|immediately|this week|next week|this month|next month|within \d+\s*(?:days?|weeks?|months?)|\d+\s*(?:days?|weeks?|months?))\b/i
  );
  return match?.[0]?.trim();
}

function extractLocation(input: string): string | undefined {
  const match = input.match(/\b(?:in|around|near)\s+([A-Za-z][A-Za-z\s-]{1,40})/i);
  if (!match?.[1]) return undefined;
  return match[1].trim().replace(/[.,!?;:]+$/, "");
}

function extractPropertyType(input: string): string | undefined {
  const knownTypes = [
    "house",
    "apartment",
    "condo",
    "townhouse",
    "duplex",
    "commercial",
    "land",
    "villa",
    "studio"
  ];
  for (const type of knownTypes) {
    const pattern = new RegExp(`\\b${type}\\b`, "i");
    if (pattern.test(input)) return type;
  }
  return undefined;
}

function wantsToBook(input: string): boolean {
  return /\b(book|schedule|appointment|call|yes|sure|lets do it|let's do it)\b/i.test(
    input
  );
}

function isNegativeReply(input: string): boolean {
  return /\b(no|not now|later|maybe later)\b/i.test(input.trim());
}

function wantsToStop(input: string): boolean {
  return /\b(stop|unsubscribe|not interested|remove me|dont contact|don't contact)\b/i.test(
    input
  );
}

function getLatestUserMessage(lead: LeadRecord): string {
  for (let index = lead.conversation.length - 1; index >= 0; index -= 1) {
    const message = lead.conversation[index];
    if (message.role === "user") {
      return message.content;
    }
  }
  return "";
}

function getLatestAssistantMessage(lead: LeadRecord): string {
  for (let index = lead.conversation.length - 1; index >= 0; index -= 1) {
    const message = lead.conversation[index];
    if (message.role === "assistant") {
      return message.content;
    }
  }
  return "";
}

function isBookingContext(lead: LeadRecord): boolean {
  if (lead.qualification.missingFields.length > 0) {
    return false;
  }

  const latestAssistantMessage = getLatestAssistantMessage(lead);
  return /\b(book|booking|schedule|appointment|strategy call|viewing|calendar)\b/i.test(
    latestAssistantMessage
  );
}
