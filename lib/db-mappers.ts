import { db } from "@/lib/db";
import type {
  LeadRecord,
  LeadStatus,
  ConversationMessage,
  AgentMessage,
  QualificationState,
  Appointment,
} from "@/lib/types";

/** The include object to pass to Prisma queries for a full lead */
export const leadInclude = {
  qualification: true,
  conversations: { orderBy: { timestamp: "asc" as const } },
  agentMessages: { orderBy: { timestamp: "asc" as const } },
  appointment: true,
  tags: true,
  agent: true,
} as const;

/**
 * The Prisma lead shape when queried with all relations included.
 * Inferred from the actual query to avoid importing the Prisma namespace.
 */
export type PrismaLeadWithRelations = Awaited<
  ReturnType<typeof db.lead.findFirst<{ include: typeof leadInclude }>>
> & {};

/** Map Prisma LeadStatus enum to the domain string union */
function mapStatus(prismaStatus: string): LeadStatus {
  if (prismaStatus === "new_lead") return "new";
  return prismaStatus as LeadStatus;
}



/**
 * Convert a Prisma Lead (with all relations) to the domain LeadRecord type.
 * This keeps qualifier.ts, domain.ts, and booking.ts untouched.
 */
export function prismaLeadToLeadRecord(
  lead: PrismaLeadWithRelations
): LeadRecord {
  const qualification: QualificationState = lead.qualification
    ? {
        budget: lead.qualification.budget ?? undefined,
        timeline: lead.qualification.timeline ?? undefined,
        location: lead.qualification.location ?? undefined,
        propertyType: lead.qualification.propertyType ?? undefined,
        confidence: lead.qualification.confidence,
        missingFields: lead.qualification.missingFields,
      }
    : {
        confidence: 0,
        missingFields: ["budget", "timeline", "location", "propertyType"],
      };

  const conversation: ConversationMessage[] = lead.conversations.map((c) => ({
    id: c.id,
    role: c.role as "user" | "assistant",
    content: c.content,
    timestamp: c.timestamp.toISOString(),
  }));

  const agentMessages: AgentMessage[] = lead.agentMessages.map((m) => ({
    id: m.id,
    sender: m.sender as "client" | "agent",
    content: m.content,
    timestamp: m.timestamp.toISOString(),
  }));

  const appointment: Appointment | undefined = lead.appointment
    ? {
        id: lead.appointment.id,
        slot: lead.appointment.slot,
        calendarLink: lead.appointment.calendarLink,
        bookedAt: lead.appointment.bookedAt.toISOString(),
      }
    : undefined;

  return {
    id: lead.id,
    name: lead.name ?? undefined,
    email: lead.email ?? undefined,
    phone: lead.phone ?? undefined,
    source: lead.source,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    status: mapStatus(lead.status),
    tags: lead.tags.map((t) => t.tag),
    qualification,
    conversation,
    appointment,
    avatar: lead.avatar ?? undefined,
    agentMessages: agentMessages.length > 0 ? agentMessages : undefined,
    agentName: lead.agent?.name ?? undefined,
    agentEmail: lead.agent?.email ?? undefined,
  };
}

/**
 * Map a Prisma LeadStatus enum value back from the domain status string.
 */
export function domainStatusToPrisma(
  status: LeadStatus
): "new_lead" | "qualifying" | "qualified" | "booked" | "disqualified" {
  if (status === "new") return "new_lead";
  return status as "qualifying" | "qualified" | "booked" | "disqualified";
}
