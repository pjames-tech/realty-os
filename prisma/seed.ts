import { PrismaClient, AgentRole, LeadStatus, ConversationRole, MessageSender } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const db = new PrismaClient();

const DEFAULT_ADMIN_PASSWORD = "realty123";

const ADMIN_ACCOUNTS = [
  { email: "admin@realtyos.com", name: "System Admin", role: AgentRole.SUPER_ADMIN, organizationName: null },
  { email: "victor@realtyos.com", name: "Victor (Broker)", role: AgentRole.ORG_ADMIN, organizationName: "Pjames Realty" },
  { email: "sarah@realtyos.com", name: "Sarah Jenkins", role: AgentRole.ORG_AGENT, organizationName: "Pjames Realty" },
  { email: "alex@realtyos.com", name: "Alex Rivera", role: AgentRole.SOLO_AGENT, organizationName: null },
];

type LegacyAgent = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  organizationName?: string;
  createdAt: string;
};

type LegacyInvitation = {
  id: string;
  token: string;
  email: string;
  organizationName: string;
  invitedById?: string;
  createdAt: string;
  usedAt?: string;
};

type LegacyQualification = {
  budget?: string;
  timeline?: string;
  location?: string;
  propertyType?: string;
  confidence?: number;
  missingFields?: string[];
};

type LegacyConversation = { role: "user" | "assistant"; content: string; timestamp: string };
type LegacyAgentMessage = { sender: "client" | "agent"; content: string; timestamp: string };
type LegacyAppointment = { slot: string; calendarLink: string; bookedAt: string };

type LegacyLead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  source?: string;
  status?: string;
  avatar?: string;
  createdAt: string;
  agentId?: string;
  agentEmail?: string;
  agentName?: string;
  qualification?: LegacyQualification;
  conversations?: LegacyConversation[];
  agentMessages?: LegacyAgentMessage[];
  appointment?: LegacyAppointment;
  tags?: string[];
};

type LegacyMetrics = {
  processedMessages?: number;
  totalResponseTimeMs?: number;
  maxResponseTimeMs?: number;
  underThreeSeconds?: number;
};

type LegacyState = {
  leads?: Record<string, LegacyLead>;
  agents?: Record<string, LegacyAgent>;
  invitations?: Record<string, LegacyInvitation>;
  metrics?: LegacyMetrics;
};

function legacyStatusToPrisma(status?: string): LeadStatus {
  switch (status) {
    case "qualifying": return LeadStatus.qualifying;
    case "qualified": return LeadStatus.qualified;
    case "booked": return LeadStatus.booked;
    case "disqualified": return LeadStatus.disqualified;
    default: return LeadStatus.new_lead;
  }
}

function legacyRoleToPrisma(role: string): AgentRole {
  switch (role) {
    case "SUPER_ADMIN": return AgentRole.SUPER_ADMIN;
    case "ORG_ADMIN": return AgentRole.ORG_ADMIN;
    case "SOLO_AGENT": return AgentRole.SOLO_AGENT;
    default: return AgentRole.ORG_AGENT;
  }
}

async function main() {
  console.log("Seeding database...");

  const statePath = resolve(process.cwd(), "data", "state.json");
  const state: LegacyState = existsSync(statePath)
    ? JSON.parse(readFileSync(statePath, "utf-8"))
    : {};

  const adminHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);

  for (const account of ADMIN_ACCOUNTS) {
    await db.agent.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        name: account.name,
        role: account.role,
        organizationName: account.organizationName,
        passwordHash: adminHash,
      },
    });
    console.log(`  ✓ Admin: ${account.email}`);
  }

  const legacyAgents = Object.values(state.agents ?? {});
  for (const agent of legacyAgents) {
    const hash = await bcrypt.hash(agent.passwordHash || DEFAULT_ADMIN_PASSWORD, 12);
    await db.agent.upsert({
      where: { email: agent.email },
      update: {},
      create: {
        email: agent.email,
        name: agent.name,
        role: legacyRoleToPrisma(agent.role),
        organizationName: agent.organizationName,
        passwordHash: hash,
        createdAt: new Date(agent.createdAt),
      },
    });
    console.log(`  ✓ Legacy agent: ${agent.email}`);
  }

  const emailToAgentId = new Map<string, string>();
  const allAgents = await db.agent.findMany({ select: { id: true, email: true } });
  for (const a of allAgents) emailToAgentId.set(a.email.toLowerCase(), a.id);

  const legacyLeads = Object.values(state.leads ?? {});
  for (const lead of legacyLeads) {
    const hashedPassword = lead.password
      ? await bcrypt.hash(lead.password, 12)
      : null;

    const agentId = lead.agentEmail
      ? emailToAgentId.get(lead.agentEmail.toLowerCase()) ?? null
      : lead.agentId ?? null;

    const created = await db.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        password: hashedPassword,
        source: lead.source ?? "website-form",
        status: legacyStatusToPrisma(lead.status),
        avatar: lead.avatar,
        createdAt: new Date(lead.createdAt),
        agentId,
        qualification: lead.qualification
          ? {
              create: {
                budget: lead.qualification.budget,
                timeline: lead.qualification.timeline,
                location: lead.qualification.location,
                propertyType: lead.qualification.propertyType,
                confidence: lead.qualification.confidence ?? 0,
                missingFields: lead.qualification.missingFields ?? ["budget", "timeline", "location", "propertyType"],
              },
            }
          : undefined,
        conversations: lead.conversations?.length
          ? {
              create: lead.conversations.map((c) => ({
                role: c.role === "assistant" ? ConversationRole.assistant : ConversationRole.user,
                content: c.content,
                timestamp: new Date(c.timestamp),
              })),
            }
          : undefined,
        agentMessages: lead.agentMessages?.length
          ? {
              create: lead.agentMessages.map((m) => ({
                sender: m.sender === "agent" ? MessageSender.agent : MessageSender.client,
                content: m.content,
                timestamp: new Date(m.timestamp),
              })),
            }
          : undefined,
        appointment: lead.appointment
          ? {
              create: {
                slot: lead.appointment.slot,
                calendarLink: lead.appointment.calendarLink,
                bookedAt: new Date(lead.appointment.bookedAt),
              },
            }
          : undefined,
        tags: lead.tags?.length
          ? { create: lead.tags.map((tag) => ({ tag })) }
          : undefined,
      },
    });
    console.log(`  ✓ Lead: ${lead.email ?? created.id}`);
  }

  const legacyInvites = Object.values(state.invitations ?? {});
  for (const invite of legacyInvites) {
    const invitedById = invite.invitedById
      ? (await db.agent.findUnique({ where: { id: invite.invitedById } }))?.id ?? null
      : null;
    await db.invitation.upsert({
      where: { token: invite.token },
      update: {},
      create: {
        token: invite.token,
        email: invite.email,
        organizationName: invite.organizationName,
        invitedById,
        createdAt: new Date(invite.createdAt),
        usedAt: invite.usedAt ? new Date(invite.usedAt) : null,
      },
    });
    console.log(`  ✓ Invitation: ${invite.email}`);
  }

  // Seed sample properties (assigned to Sarah — the demo ORG_AGENT)
  const sampleAgent = await db.agent.findUnique({ where: { email: "sarah@realtyos.com" } });
  if (sampleAgent) {
    const existingCount = await db.property.count({ where: { agentId: sampleAgent.id } });
    if (existingCount === 0) {
      const SAMPLE_PROPERTIES = [
        {
          title: "Ocean View Estate",
          description: "Stunning oceanfront home with panoramic views and modern finishes throughout.",
          price: 3450000, beds: 5, baths: 4, sqft: 4200,
          type: "single_family" as const, status: "active" as const,
          address: "1042 Pacific Coast Highway", city: "Malibu", state: "CA", zip: "90265",
          images: ["/property-1.png"],
          features: ["Ocean view", "Pool", "3-car garage", "Smart home", "Wine cellar"],
        },
        {
          title: "Pacific Palisades Modern",
          description: "Contemporary architecture meets timeless elegance in this sunlit home.",
          price: 2180000, beds: 4, baths: 3, sqft: 3100,
          type: "single_family" as const, status: "active" as const,
          address: "889 West Oak Avenue", city: "Pacific Palisades", state: "CA", zip: "90272",
          images: ["/property-2.png"],
          features: ["Open floor plan", "Chef's kitchen", "Hardwood floors", "Landscaped garden"],
        },
        {
          title: "Santa Monica Retreat",
          description: "Charming family home steps from the beach and top-rated schools.",
          price: 1890000, beds: 3, baths: 3, sqft: 2400,
          type: "townhouse" as const, status: "active" as const,
          address: "221 Ocean Terrace", city: "Santa Monica", state: "CA", zip: "90405",
          images: ["/property-3.png"],
          features: ["Near beach", "Top schools", "Rooftop deck", "Renovated 2023"],
        },
        {
          title: "Hollywood Hills Contemporary",
          description: "Sleek hillside estate with skyline views and private infinity pool.",
          price: 4200000, beds: 4, baths: 5, sqft: 5600,
          type: "single_family" as const, status: "active" as const,
          address: "1780 Skyline Drive", city: "Los Angeles", state: "CA", zip: "90068",
          images: ["/property-4.png"],
          features: ["Skyline view", "Infinity pool", "Home theater", "Gym", "Wine cellar"],
        },
        {
          title: "Beverly Hills Terrace",
          description: "Luxurious residence in one of Beverly Hills' most sought-after streets.",
          price: 1150000, beds: 2, baths: 2, sqft: 1800,
          type: "condo" as const, status: "active" as const,
          address: "450 Terrace Drive", city: "Beverly Hills", state: "CA", zip: "90210",
          images: ["/property-1.png"],
          features: ["Concierge", "Fitness center", "24/7 security"],
        },
        {
          title: "Silver Lake Craftsman",
          description: "Beautifully restored 1920s craftsman with modern updates.",
          price: 985000, beds: 3, baths: 2, sqft: 1950,
          type: "single_family" as const, status: "active" as const,
          address: "3210 Silver Lake Boulevard", city: "Los Angeles", state: "CA", zip: "90039",
          images: ["/property-2.png"],
          features: ["Historic", "Period details", "Large backyard", "Detached studio"],
        },
      ];

      for (const prop of SAMPLE_PROPERTIES) {
        await db.property.create({
          data: { ...prop, agentId: sampleAgent.id },
        });
        console.log(`  ✓ Property: ${prop.title}`);
      }
    }
  }

  const m = state.metrics ?? {};
  await db.metrics.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      processedMessages: m.processedMessages ?? 0,
      totalResponseTimeMs: m.totalResponseTimeMs ?? 0,
      maxResponseTimeMs: m.maxResponseTimeMs ?? 0,
      underThreeSeconds: m.underThreeSeconds ?? 0,
    },
  });
  console.log("  ✓ Metrics singleton");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
