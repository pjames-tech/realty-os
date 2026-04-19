"use client";

import { useCallback, useEffect, useState } from "react";
import { LeadRecord } from "@/lib/types";
import { getLeadTemperature } from "@/lib/admin-helpers";

export interface AdminMetrics {
  processedMessages: number;
  averageResponseTimeMs: number;
  maxResponseTimeMs: number;
  underThreeSecondsRate: number;
}

export interface DerivedStats {
  totalLeads: number;
  newLeads: number;
  qualifyingLeads: number;
  qualifiedLeads: number;
  bookedLeads: number;
  disqualifiedLeads: number;
  conversionRate: number;       // qualified ÷ total (%)
  hotLeads: number;             // confidence >= 70
  warmLeads: number;            // 40-69
  coldLeads: number;            // < 40
  sourceCounts: Record<string, number>;
  leadsWithAppointments: LeadRecord[];
  recentLeads: LeadRecord[];    // latest 10
}

const EMPTY_METRICS: AdminMetrics = {
  processedMessages: 0,
  averageResponseTimeMs: 0,
  maxResponseTimeMs: 0,
  underThreeSecondsRate: 0
};

function computeStats(leads: LeadRecord[]): DerivedStats {
  const sourceCounts: Record<string, number> = {};
  let hot = 0, warm = 0, cold = 0;

  for (const lead of leads) {
    // Source counts
    const src = lead.source || "unknown";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;

    // Temperature
    const temp = getLeadTemperature(lead.qualification.confidence);
    if (temp === "hot") hot++;
    else if (temp === "warm") warm++;
    else cold++;
  }

  const qualified = leads.filter((l) => l.status === "qualified" || l.status === "booked").length;
  const total = leads.length;

  return {
    totalLeads: total,
    newLeads: leads.filter((l) => l.status === "new").length,
    qualifyingLeads: leads.filter((l) => l.status === "qualifying").length,
    qualifiedLeads: leads.filter((l) => l.status === "qualified").length,
    bookedLeads: leads.filter((l) => l.status === "booked").length,
    disqualifiedLeads: leads.filter((l) => l.status === "disqualified").length,
    conversionRate: total > 0 ? Number(((qualified / total) * 100).toFixed(1)) : 0,
    hotLeads: hot,
    warmLeads: warm,
    coldLeads: cold,
    sourceCounts,
    leadsWithAppointments: leads
      .filter((l) => l.appointment)
      .sort((a, b) =>
        new Date(a.appointment!.slot).getTime() - new Date(b.appointment!.slot).getTime()
      ),
    recentLeads: leads.slice(0, 10) // already sorted by updatedAt from API
  };
}

export function useAdminData() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, metricsRes] = await Promise.all([
        fetch("/api/leads", { cache: "no-store" }),
        fetch("/api/metrics", { cache: "no-store" })
      ]);
      const leadsPayload = await leadsRes.json();
      const metricsPayload = await metricsRes.json();
      setLeads(Array.isArray(leadsPayload.leads) ? leadsPayload.leads : []);
      setMetrics(metricsPayload || EMPTY_METRICS);
    } catch {
      console.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const stats = computeStats(leads);

  return { leads, metrics, stats, loading, refresh };
}
