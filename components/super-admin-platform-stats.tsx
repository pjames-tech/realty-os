"use client";

import { useEffect, useState } from "react";
import { Metrics } from "@/lib/types";

export function SuperAdminPlatformStats() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/metrics", { cache: "no-store" }).then(r => r.json()),
      fetch("/api/leads", { cache: "no-store" }).then(r => r.json())
    ]).then(([metricsData, leadsData]) => {
      setMetrics(metricsData.metrics);
      setLeadCount(Object.keys(leadsData.leads || {}).length);
    }).catch(console.error);
  }, []);

  const avgLatency = metrics?.processedMessages ? Math.round(metrics.totalResponseTimeMs / metrics.processedMessages) : 0;
  const sla = metrics?.processedMessages ? Math.round((metrics.underThreeSeconds / metrics.processedMessages) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div>
        <div style={{ color: "#F25C05", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Performance</div>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>Platform Statistics</h1>
        <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>Real-time analytics across all agencies and AI systems.</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "16px" }}>Total Leads</h3>
          <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>{leadCount}</span>
        </div>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "16px" }}>Messages Processed</h3>
          <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>{metrics?.processedMessages || 0}</span>
        </div>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "16px" }}>Avg Latency</h3>
          <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>{avgLatency}ms</span>
        </div>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "16px" }}>SLA Compliance</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>{sla}%</span>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sla >= 90 ? "#10B981" : "#EF4444" }}></span>
          </div>
        </div>
      </div>

      {/* Two Col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* AI Performance */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: "0 0 24px 0" }}>AI Performance</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                <span style={{ color: "#64748B" }}>Response Time</span>
                <span style={{ color: "#0F172A" }}>{avgLatency}ms</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "3px" }}>
                <div style={{ width: `${Math.min(100, (avgLatency / 3000) * 100)}%`, height: "100%", background: "#F25C05", borderRadius: "3px" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                <span style={{ color: "#64748B" }}>Under 3s Rate</span>
                <span style={{ color: "#0F172A" }}>{sla}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "3px" }}>
                <div style={{ width: `${sla}%`, height: "100%", background: "#10B981", borderRadius: "3px" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: "0 0 24px 0" }}>Lead Source Distribution</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { name: "Sloane Chatbot", pct: 68, color: "#F25C05" },
              { name: "Website Form", pct: 22, color: "#3B82F6" },
              { name: "Portal Inquiry", pct: 10, color: "#10B981" }
            ].map(src => (
              <div key={src.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                  <span style={{ color: "#64748B" }}>{src.name}</span>
                  <span style={{ color: "#0F172A" }}>{src.pct}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "3px" }}>
                  <div style={{ width: `${src.pct}%`, height: "100%", background: src.color, borderRadius: "3px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
