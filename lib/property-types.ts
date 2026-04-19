export type PropertyCard = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  beds: number;
  baths: number;
  sqft?: number | null;
  type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  images: string[];
  features: string[];
  createdAt: string;
  agent?: { id: string; name: string; email?: string } | null;
};

export type TourRecord = {
  id: string;
  scheduledAt: string;
  type: "in_person" | "virtual";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string | null;
  property: PropertyCard;
};

export type SavedRecord = {
  id: string;
  savedAt: string;
  property: PropertyCard;
};

export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 2)}M`;
  }
  if (price >= 1_000) {
    return `$${Math.round(price / 1_000)}k`;
  }
  return `$${price.toLocaleString()}`;
}

export function formatPropertyType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatTourType(type: string): string {
  return type === "in_person" ? "In-person Tour" : "Virtual Tour";
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function formatTourDate(dateStr: string): { date: string; time: string; isTomorrow: boolean } {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  return {
    date: isTomorrow
      ? "Tomorrow"
      : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    isTomorrow,
  };
}
