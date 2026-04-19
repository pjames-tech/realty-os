import { LeadRecord } from "@/lib/types";

/* ── Avatar initials ── */
export function getInitials(name?: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/* ── Source → color mapping ── */
const SOURCE_COLORS: Record<string, string> = {
  "website-form": "blue",
  "chatbot": "orange",
  "zillow": "blue",
  "facebook": "purple",
  "google": "red",
  "referral": "purple",
  "instagram": "purple",
  "direct": "gray"
};

export function getSourceColor(source: string): string {
  const lower = source.toLowerCase();
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "gray";
}

export function getSourceLabel(source: string): string {
  const lower = source.toLowerCase();
  if (lower.includes("chatbot")) return "Chatbot";
  if (lower.includes("zillow")) return "Zillow";
  if (lower.includes("facebook")) return "Facebook";
  if (lower.includes("google")) return "Google";
  if (lower.includes("referral")) return "Referral";
  if (lower.includes("instagram")) return "Instagram";
  if (lower.includes("website") || lower.includes("form")) return "Website Form";
  return source;
}

/* ── Status → badge style ── */
const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "purple-light" },
  qualifying: { label: "Qualifying", color: "yellow" },
  qualified: { label: "Qualified", color: "green" },
  booked: { label: "Booked", color: "green" },
  disqualified: { label: "Disqualified", color: "yellow" }
};

export function getStatusBadge(status: string) {
  return STATUS_BADGES[status] || { label: status, color: "gray" };
}

/* ── Relative time ── */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "JUST NOW";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} MIN${diffMin > 1 ? "S" : ""} AGO`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} HR${diffHr > 1 ? "S" : ""} AGO`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} DAY${diffDay > 1 ? "S" : ""} AGO`;
}

/* ── Confidence → temperature ── */
export function getLeadTemperature(confidence: number): "hot" | "warm" | "cold" {
  if (confidence >= 70) return "hot";
  if (confidence >= 40) return "warm";
  return "cold";
}

/* ── Avatar BG color rotation ── */
const AVATAR_COLORS = ["orange", "blue", "yellow", "purple"];
export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/* ── CSV Export ── */
export function exportLeadsToCsv(leads: LeadRecord[]) {
  const headers = ["Name", "Email", "Phone", "Source", "Status", "Confidence", "Created", "Tags"];
  const rows = leads.map((l) => [
    l.name || "",
    l.email || "",
    l.phone || "",
    l.source,
    l.status,
    String(l.qualification.confidence),
    l.createdAt,
    l.tags.join("; ")
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `realtyos-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
