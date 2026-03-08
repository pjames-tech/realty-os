import { LeadRecord, LeadStatus, QualificationState } from "@/lib/types";

const REQUIRED_FIELDS: (keyof QualificationState)[] = [
  "budget",
  "timeline",
  "location",
  "propertyType"
];

export function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function computeMissingFields(
  qualification: Partial<QualificationState>
): string[] {
  return REQUIRED_FIELDS.filter((field) => {
    const value = qualification[field];
    return !value || String(value).trim().length === 0;
  }).map(String);
}

export function clampConfidence(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function confidenceTag(confidence: number): string {
  if (confidence >= 0.8) return "confidence:high";
  if (confidence >= 0.5) return "confidence:medium";
  return "confidence:low";
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function determineStatus(lead: LeadRecord): LeadStatus {
  if (lead.status === "disqualified") {
    return "disqualified";
  }
  if (lead.appointment) {
    return "booked";
  }
  if (
    lead.qualification.missingFields.length === 0 &&
    lead.qualification.confidence >= 0.8
  ) {
    return "qualified";
  }
  if (lead.conversation.length > 0) {
    return "qualifying";
  }
  return "new";
}

export function applyQualificationUpdates(
  lead: LeadRecord,
  updates: Partial<QualificationState>,
  confidence: number,
  action: "reply" | "book" | "disqualify"
): LeadRecord {
  const next = { ...lead };
  next.qualification = {
    ...next.qualification,
    ...removeEmptyValues(updates),
    confidence: clampConfidence(confidence),
    missingFields: []
  };

  next.qualification.missingFields = computeMissingFields(next.qualification);
  next.updatedAt = nowIso();

  if (action === "disqualify") {
    next.appointment = undefined;
    next.status = "disqualified";
  } else {
    next.status = determineStatus(next);
  }

  next.tags = deriveTags(next);
  return next;
}

export function deriveTags(lead: LeadRecord): string[] {
  const tags = new Set<string>();
  tags.add(`status:${lead.status}`);
  tags.add(confidenceTag(lead.qualification.confidence));

  if (lead.source) {
    tags.add(`source:${slug(lead.source)}`);
  }
  if (lead.qualification.location) {
    tags.add(`location:${slug(lead.qualification.location)}`);
  }
  if (lead.qualification.propertyType) {
    tags.add(`type:${slug(lead.qualification.propertyType)}`);
  }
  if (lead.qualification.budget) {
    tags.add("budget:known");
  }
  if (lead.qualification.timeline) {
    tags.add("timeline:known");
  }
  if (lead.qualification.missingFields.length === 0) {
    tags.add("qualification:complete");
  } else {
    tags.add("qualification:incomplete");
  }
  if (lead.appointment) {
    tags.add("appointment:booked");
  }

  return Array.from(tags);
}

function removeEmptyValues<T extends object>(obj: T): Partial<T> {
  const entries = Object.entries(obj).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  });
  return Object.fromEntries(entries) as Partial<T>;
}
