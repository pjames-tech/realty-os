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

// ─── Intent Signal Analysis ───────────────────────────────────────────────────

interface IntentSignals {
  urgency: number;
  specificity: number;
  engagement: number;
  negativity: number;
  bookingWillingness: number;
  repeatVisitor: number;
}

function computeIntentSignals(lead: LeadRecord, message: string): IntentSignals {
  const lowerMsg = message.toLowerCase();
  const conversationLength = lead.conversation.length;

  // Urgency: ASAP, immediately, urgent, this week, need now, etc.
  const urgency =
    /\b(asap|immediately|urgent|urgently|right away|this week|need now|as soon as possible|time.?sensitive|moving fast)\b/i.test(message)
      ? 0.15
      : 0;

  // Specificity: exact addresses, neighborhoods, precise dollar amounts, bedroom counts
  const specificityIndicators = [
    /\d{4,5}\s+[A-Z]/i.test(message), // street addresses (e.g. "1234 Oak St")
    /\$\s?\d[\d,]*/.test(message), // dollar amounts
    /\d+\s*(?:bed|br|bedroom)/i.test(message), // bedroom counts
    /\b\d{5}\b/.test(message), // zip codes
    message.length > 80 // detailed responses
  ];
  const specificity = Math.min(0.15, specificityIndicators.filter(Boolean).length * 0.05);

  // Engagement: follow-up questions, detailed answers, question marks
  const engagementIndicators = [
    lowerMsg.includes("?"), // asking questions
    message.length > 60, // longer responses show engagement
    /\b(also|additionally|another thing|by the way|what about)\b/i.test(message),
    /\b(tell me|can you|how about|what if|do you have)\b/i.test(message)
  ];
  const engagement = Math.min(0.10, engagementIndicators.filter(Boolean).length * 0.035);

  // Negativity: just browsing, not sure, maybe later, no rush
  const negativity =
    /\b(just browsing|not sure|maybe later|just looking|no rush|no hurry|window shopping|not ready|just curious|exploring options)\b/i.test(message)
      ? -0.30
      : 0;

  // Booking willingness
  const bookingWillingness =
    /\b(book|schedule|appointment|yes|sure|lets do it|let's do it|sign me up|sounds good|go ahead|let's go|absolutely|definitely)\b/i.test(message)
      ? 0.20
      : 0;

  // Repeat visitor: multiple conversation turns
  const repeatVisitor = conversationLength >= 5 ? 0.10 : conversationLength >= 3 ? 0.05 : 0;

  return { urgency, specificity, engagement, negativity, bookingWillingness, repeatVisitor };
}

function computeIntentScore(signals: IntentSignals): number {
  const raw =
    signals.urgency +
    signals.specificity +
    signals.engagement +
    signals.negativity +
    signals.bookingWillingness +
    signals.repeatVisitor;
  // Normalize: max possible positive is 0.70, so scale to [0, 1]
  return clamp((raw + 0.30) / 1.0); // shift so 0 negativity = 0.30 base
}

function computeConfidence(missingCount: number, intentScore: number): number {
  const fieldScore = clamp(1 - missingCount * 0.25);
  // 60% field completeness + 40% intent signals
  return clamp(fieldScore * 0.6 + intentScore * 0.4);
}

// ─── Main Qualification Function ──────────────────────────────────────────────

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
    return normalizeDecision(lead, message, parsed);
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
  message: string,
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

  // Blend AI confidence with intent signals
  const intentSignals = computeIntentSignals(lead, message);
  const intentScore = computeIntentScore(intentSignals);
  const aiConfidence =
    typeof decision.confidence === "number"
      ? clamp(decision.confidence)
      : clamp(1 - missing.length * 0.25);
  const confidence = clamp(aiConfidence * 0.7 + intentScore * 0.3);

  return {
    reply,
    updates: { ...updates, missingFields: missing },
    confidence,
    action
  };
}

// ─── Local Fallback (No OpenAI Key) ──────────────────────────────────────────

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

  // Intent-based confidence
  const intentSignals = computeIntentSignals(lead, message);
  const intentScore = computeIntentScore(intentSignals);
  const confidence = computeConfidence(missing.length, intentScore);

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
      confidence: Math.max(confidence, 0.95),
      action: "book"
    };
  }

  if (bookingDeclined) {
    return {
      reply:
        "No problem. I will keep your details on file, and you can book the strategy call whenever you're ready.",
      updates: { ...sanitizeUpdates(updates), missingFields: missing },
      confidence: Math.max(confidence, 0.9),
      action: "reply"
    };
  }

  if (missing.length === 0) {
    return {
      reply:
        "Great, I have everything I need. Do you want me to book a 15-minute strategy call?",
      updates: { ...sanitizeUpdates(updates), missingFields: missing },
      confidence: Math.max(confidence, 0.9),
      action: "reply"
    };
  }

  return {
    reply: fallbackQuestion(missing[0]),
    updates: { ...sanitizeUpdates(updates), missingFields: missing },
    confidence,
    action: "reply"
  };
}

// ─── Improved Regex Extractors ───────────────────────────────────────────────

function extractBudget(input: string): string | undefined {
  // Ranges like "$500k - $1M", "500k to 1M"
  const rangeMatch = input.match(
    /\$?\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million|thousand)?\s*(?:-|to|–)\s*\$?\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million|thousand)?/i
  );
  if (rangeMatch) return rangeMatch[0].trim();

  // Prefixed amounts: "under $500k", "over $1M", "around $2 million"
  const prefixedMatch = input.match(
    /\b(?:under|over|around|about|approximately|less than|more than|up to|at least|max|minimum|maximum)\s+\$?\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million|thousand)?/i
  );
  if (prefixedMatch) return prefixedMatch[0].trim();

  // Written amounts: "half a million", "a million", "two million"
  const writtenMatch = input.match(
    /\b(?:half a million|quarter million|a million|one million|two million|three million|four million|five million|ten million)\b/i
  );
  if (writtenMatch) return writtenMatch[0].trim();

  // Simple dollar amounts: "$500k", "$1.2M", "$300,000"
  const simpleMatch = input.match(
    /\$\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million|thousand)?/i
  );
  if (simpleMatch) return simpleMatch[0].trim();

  // Numbers with k/m suffix without $: "500k", "1.5M"
  const suffixMatch = input.match(
    /\b\d[\d,]*(?:\.\d+)?\s?(?:k|m)\b/i
  );
  if (suffixMatch) return "$" + suffixMatch[0].trim();

  return undefined;
}

function extractTimeline(input: string): string | undefined {
  // Quarters: "Q1", "Q2 2026"
  const quarterMatch = input.match(
    /\bQ[1-4]\s*(?:20\d{2})?\b/i
  );
  if (quarterMatch) return quarterMatch[0].trim();

  // Seasons: "by summer", "this winter", "next spring", "next fall"
  const seasonMatch = input.match(
    /\b(?:by|this|next|before|after)\s+(?:spring|summer|fall|autumn|winter)\b/i
  );
  if (seasonMatch) return seasonMatch[0].trim();

  // Relative end/beginning: "end of year", "beginning of next year"
  const relativeMatch = input.match(
    /\b(?:end of|beginning of|start of|middle of)\s+(?:the\s+)?(?:this\s+)?(?:year|month|next year|next month)\b/i
  );
  if (relativeMatch) return relativeMatch[0].trim();

  // Range: "3-6 months", "a few weeks"
  const rangeMatch = input.match(
    /\b(?:\d+\s*-\s*\d+|a few|a couple(?: of)?|several)\s*(?:days?|weeks?|months?|years?)\b/i
  );
  if (rangeMatch) return rangeMatch[0].trim();

  // Standard: "asap", "immediately", "this week", "next month", "within 3 months"
  const standardMatch = input.match(
    /\b(asap|immediately|right away|this week|next week|this month|next month|within\s+\d+\s*(?:days?|weeks?|months?|years?)|\d+\s*(?:days?|weeks?|months?|years?))\b/i
  );
  if (standardMatch) return standardMatch[0].trim();

  return undefined;
}

function extractLocation(input: string): string | undefined {
  // City, State abbreviation: "Austin, TX", "Los Angeles, CA"
  const cityStateMatch = input.match(
    /\b([A-Z][a-zA-Z\s-]{1,25}),\s*([A-Z]{2})\b/
  );
  if (cityStateMatch) return cityStateMatch[0].trim();

  // Zip codes: "78701", "90210"
  const zipMatch = input.match(/\b(\d{5})(?:-\d{4})?\b/);
  if (zipMatch) return zipMatch[0].trim();

  // Preposition + location: "in Austin", "around Lagos", "near Lekki", "moving to Dallas"
  const prepMatch = input.match(
    /\b(?:in|around|near|to|from|at|within)\s+([A-Z][a-zA-Z][a-zA-Z\s-]{0,35})/
  );
  if (prepMatch?.[1]) {
    return prepMatch[1].trim().replace(/[.,!?;:]+$/, "");
  }

  // "looking in X", "moving to X", "somewhere in X", "relocating to X"
  const actionMatch = input.match(
    /\b(?:looking|moving|relocating|settling|living|staying|searching)\s+(?:in|to|around|near)\s+([A-Z][a-zA-Z][a-zA-Z\s-]{0,35})/i
  );
  if (actionMatch?.[1]) {
    return actionMatch[1].trim().replace(/[.,!?;:]+$/, "");
  }

  return undefined;
}

function extractPropertyType(input: string): string | undefined {
  // Multi-word types first (match before single words)
  const multiWordTypes = [
    "single family",
    "single-family",
    "multi family",
    "multi-family",
    "town house",
    "town home",
    "mobile home"
  ];
  for (const type of multiWordTypes) {
    const pattern = new RegExp(`\\b${type}\\b`, "i");
    if (pattern.test(input)) return type.replace("-", " ");
  }

  // Bedroom patterns: "3 bedroom", "4BR", "3-bed", "2 bed house"
  const bedroomMatch = input.match(
    /\b(\d+)\s*(?:-?\s*)?(?:bed(?:room)?s?|br)\b/i
  );
  if (bedroomMatch) return `${bedroomMatch[1]}-bedroom`;

  // Single-word types
  const knownTypes = [
    "house", "home", "apartment", "condo", "condominium", "townhouse", "townhome",
    "duplex", "triplex", "commercial", "land", "villa", "studio", "loft",
    "penthouse", "bungalow", "ranch", "cottage", "mansion", "flat", "maisonette"
  ];
  for (const type of knownTypes) {
    const pattern = new RegExp(`\\b${type}\\b`, "i");
    if (pattern.test(input)) {
      // Normalize aliases
      if (type === "home") return "house";
      if (type === "condominium") return "condo";
      if (type === "townhome") return "townhouse";
      if (type === "flat") return "apartment";
      return type;
    }
  }

  return undefined;
}

// ─── Utility Functions ───────────────────────────────────────────────────────

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

function wantsToBook(input: string): boolean {
  return /\b(book|schedule|appointment|call|yes|sure|lets do it|let's do it|go ahead|sounds good|absolutely|definitely|sign me up)\b/i.test(
    input
  );
}

function isNegativeReply(input: string): boolean {
  return /\b(no|not now|later|maybe later|not yet|nah)\b/i.test(input.trim());
}

function wantsToStop(input: string): boolean {
  return /\b(stop|unsubscribe|not interested|remove me|dont contact|don't contact|go away|leave me alone)\b/i.test(
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
