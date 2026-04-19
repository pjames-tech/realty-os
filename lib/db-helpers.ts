import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { deriveTags } from "@/lib/domain";
import {
  leadInclude,
  prismaLeadToLeadRecord,
  domainStatusToPrisma,
} from "@/lib/db-mappers";
import type { LeadRecord } from "@/lib/types";

const BCRYPT_ROUNDS = 12;

// ─── Agent helpers ───────────────────────────────────────

export async function createAgent(input: {
  name: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_AGENT" | "SOLO_AGENT";
  organizationName?: string;
  supabaseUserId?: string;
}) {
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  return db.agent.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      organizationName: input.organizationName,
      supabaseUserId: input.supabaseUserId,
    },
  });
}

// ─── Lead helpers ────────────────────────────────────────

export async function findLeadByEmail(email: string) {
  if (!email || email.trim().length === 0) return null;
  return db.lead.findFirst({
    where: { email: email.trim().toLowerCase() },
    include: leadInclude,
  });
}

export async function createLead(input: {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  password?: string;
  agentId?: string;
}) {
  const passwordHash = input.password
    ? await bcrypt.hash(input.password, BCRYPT_ROUNDS)
    : null;

  const lead = await db.lead.create({
    data: {
      name: input.name,
      email: input.email?.toLowerCase(),
      phone: input.phone,
      source: input.source || "website-form",
      password: passwordHash,
      agentId: input.agentId,
      qualification: {
        create: {
          confidence: 0,
          missingFields: ["budget", "timeline", "location", "propertyType"],
        },
      },
    },
    include: leadInclude,
  });

  // Derive and persist initial tags
  const leadRecord = prismaLeadToLeadRecord(lead);
  const tags = deriveTags(leadRecord);
  if (tags.length > 0) {
    await db.leadTag.createMany({
      data: tags.map((tag) => ({ leadId: lead.id, tag })),
      skipDuplicates: true,
    });
  }

  return db.lead.findUniqueOrThrow({
    where: { id: lead.id },
    include: leadInclude,
  });
}

export async function getLeadById(leadId: string) {
  return db.lead.findUnique({
    where: { id: leadId },
    include: leadInclude,
  });
}

// ─── Conversation helpers ────────────────────────────────

export async function appendConversation(
  leadId: string,
  role: "user" | "assistant",
  content: string
) {
  await db.conversationMessage.create({
    data: { leadId, role, content },
  });
  await db.lead.update({
    where: { id: leadId },
    data: { updatedAt: new Date() },
  });
}

export async function appendAgentMessage(
  leadId: string,
  sender: "client" | "agent",
  content: string
) {
  await db.agentMessage.create({
    data: { leadId, sender, content },
  });
  await db.lead.update({
    where: { id: leadId },
    data: { updatedAt: new Date() },
  });
}

// ─── Lead update from domain logic ───────────────────────

/**
 * Persist changes from domain logic (applyQualificationUpdates) back to the DB.
 * Call this after running the qualifier and domain functions on a LeadRecord.
 */
export async function persistLeadFromDomain(leadRecord: LeadRecord) {
  const { id, qualification, tags, status } = leadRecord;

  await db.$transaction([
    // Update lead status
    db.lead.update({
      where: { id },
      data: {
        status: domainStatusToPrisma(status),
        updatedAt: new Date(),
      },
    }),
    // Update qualification
    db.qualification.upsert({
      where: { leadId: id },
      create: {
        leadId: id,
        budget: qualification.budget,
        timeline: qualification.timeline,
        location: qualification.location,
        propertyType: qualification.propertyType,
        confidence: qualification.confidence,
        missingFields: qualification.missingFields,
      },
      update: {
        budget: qualification.budget,
        timeline: qualification.timeline,
        location: qualification.location,
        propertyType: qualification.propertyType,
        confidence: qualification.confidence,
        missingFields: qualification.missingFields,
      },
    }),
    // Sync tags: delete all then recreate
    db.leadTag.deleteMany({ where: { leadId: id } }),
    db.leadTag.createMany({
      data: tags.map((tag) => ({ leadId: id, tag })),
      skipDuplicates: true,
    }),
  ]);

  // If booked, create/update appointment
  if (leadRecord.appointment) {
    await db.appointment.upsert({
      where: { leadId: id },
      create: {
        leadId: id,
        slot: leadRecord.appointment.slot,
        calendarLink: leadRecord.appointment.calendarLink,
        bookedAt: new Date(leadRecord.appointment.bookedAt),
      },
      update: {
        slot: leadRecord.appointment.slot,
        calendarLink: leadRecord.appointment.calendarLink,
      },
    });
  }
}

// ─── Metrics helpers ─────────────────────────────────────

export async function trackResponseMetrics(responseTimeMs: number) {
  const existing = await db.metrics.findUnique({ where: { id: "global" } });
  const currentMax = existing?.maxResponseTimeMs ?? 0;

  await db.metrics.upsert({
    where: { id: "global" },
    create: {
      processedMessages: 1,
      totalResponseTimeMs: responseTimeMs,
      maxResponseTimeMs: responseTimeMs,
      underThreeSeconds: responseTimeMs <= 3000 ? 1 : 0,
    },
    update: {
      processedMessages: { increment: 1 },
      totalResponseTimeMs: { increment: responseTimeMs },
      maxResponseTimeMs: Math.max(currentMax, responseTimeMs),
      underThreeSeconds:
        responseTimeMs <= 3000 ? { increment: 1 } : undefined,
    },
  });
}
