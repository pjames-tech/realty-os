export type LeadStatus =
  | "new"
  | "qualifying"
  | "qualified"
  | "booked"
  | "disqualified";

export type ConversationRole = "user" | "assistant";

export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  content: string;
  timestamp: string;
}

export interface AgentMessage {
  id: string;
  sender: "client" | "agent";
  content: string;
  timestamp: string;
}

export interface QualificationState {
  budget?: string;
  timeline?: string;
  location?: string;
  propertyType?: string;
  confidence: number;
  missingFields: string[];
}

export interface Appointment {
  id: string;
  slot: string;
  calendarLink: string;
  bookedAt: string;
}

export interface LeadRecord {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  tags: string[];
  qualification: QualificationState;
  conversation: ConversationMessage[];
  appointment?: Appointment;
  avatar?: string;
  agentMessages?: AgentMessage[];
  agentName?: string;
  agentEmail?: string;
}

export interface Metrics {
  processedMessages: number;
  totalResponseTimeMs: number;
  maxResponseTimeMs: number;
  underThreeSeconds: number;
}

export interface AgentAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // Simplistic mock storage
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_AGENT" | "SOLO_AGENT";
  organizationName?: string;
  createdAt: string;
}

export interface AgentInvite {
  token: string;
  email: string;
  organizationName: string;
  createdAt: string;
}

export interface RealtyState {
  leads: Record<string, LeadRecord>;
  metrics: Metrics;
  agents: Record<string, AgentAccount>;
  invitations: Record<string, AgentInvite>;
}

export interface IngestPayload {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  message: string;
  agentId?: string;
}

export interface LeadMessagePayload {
  message: string;
}

export interface BookingPayload {
  slot?: string;
}

export interface QualificationDecision {
  reply: string;
  updates: Partial<QualificationState>;
  confidence: number;
  action: "reply" | "book" | "disqualify";
}
