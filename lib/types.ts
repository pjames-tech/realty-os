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
}

export interface Metrics {
  processedMessages: number;
  totalResponseTimeMs: number;
  maxResponseTimeMs: number;
  underThreeSeconds: number;
}

export interface RealtyState {
  leads: Record<string, LeadRecord>;
  metrics: Metrics;
}

export interface IngestPayload {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  message: string;
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
