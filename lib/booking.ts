import { generateId, nowIso } from "@/lib/domain";
import { Appointment, LeadRecord } from "@/lib/types";

const CAL_BOOKING_URL = process.env.CAL_BOOKING_URL?.trim();

function nextBusinessSlot(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  return date.toISOString();
}

function buildCalendarLink(slotIso: string, leadId: string): string {
  if (CAL_BOOKING_URL) {
    return buildCalBookingLink(CAL_BOOKING_URL, leadId, slotIso);
  }

  const start = new Date(slotIso);
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const title = encodeURIComponent(`RealtyOS Strategy Call (${leadId})`);
  const details = encodeURIComponent("Auto-booked by RealtyOS Auto-Qualifier");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${fmt(start)}/${fmt(end)}`;
}

function buildCalBookingLink(
  baseUrl: string,
  leadId: string,
  slotIso: string
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "realty-os");
  url.searchParams.set("leadId", leadId);
  url.searchParams.set("slot", slotIso);
  return url.toString();
}

export function createAppointment(leadId: string, slot?: string): Appointment {
  const finalSlot = slot || nextBusinessSlot();
  return {
    id: generateId("apt"),
    slot: finalSlot,
    calendarLink: buildCalendarLink(finalSlot, leadId),
    bookedAt: nowIso()
  };
}

export function markLeadBooked(lead: LeadRecord, slot?: string): LeadRecord {
  const next = { ...lead };
  if (!next.appointment) {
    next.appointment = createAppointment(next.id, slot);
  }
  next.status = "booked";
  next.updatedAt = nowIso();
  return next;
}
