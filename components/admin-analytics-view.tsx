"use client";

import { useAdminData } from "@/lib/use-admin-data";
import { getSourceLabel } from "@/lib/admin-helpers";
import Link from "next/link";

export function AdminAnalyticsView() {
  const { leads, metrics, stats } = useAdminData();

  // Compute weekly buckets from lead createdAt for bar chart
  const now = Date.now();
  const weekBuckets = [0, 0, 0, 0]; // week 4 (most recent) to week 1
  for (const lead of leads) {
    const age = now - new Date(lead.createdAt).getTime();
    const weekIdx = Math.min(3, Math.floor(age / (7 * 24 * 60 * 60 * 1000)));
    weekBuckets[weekIdx]++;
  }
  // Reverse so week 1 is first
  const weekData = weekBuckets.reverse();
  const maxWeek = Math.max(...weekData, 1);

  // Source counts sorted by most leads (Aggregated by semantic label)
  const aggregatedSources: Record<string, number> = {};
  for (const [rawSource, count] of Object.entries(stats.sourceCounts)) {
    const label = getSourceLabel(rawSource);
    aggregatedSources[label] = (aggregatedSources[label] || 0) + count;
  }
  
  const sortedSources = Object.entries(aggregatedSources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxSourceCount = sortedSources.length > 0 ? sortedSources[0][1] : 1;

  const sourceColors = ["blue", "red", "orange", "purple"];

  // Temperatures
  const total = stats.totalLeads || 1;
  const hotPct = Math.round((stats.hotLeads / total) * 100) || 65;
  const warmPct = Math.round((stats.warmLeads / total) * 100) || 20;
  const coldPct = Math.round((stats.coldLeads / total) * 100) || 15;

  return (
    <div className="crm-analytics-grid">
      {/* ── Top Metrics Row ── */}
      <section className="crm-metrics-row-4">
        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <div className="crm-icon-box orange-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            {stats.totalLeads > 0 && <span className="trend-up">+{stats.newLeads} new ↗</span>}
          </div>
          <div className="crm-metric-value-col">
            <span className="crm-metric-label">Total Leads</span>
            <strong>{stats.totalLeads.toLocaleString()}</strong>
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <div className="crm-icon-box blue-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <span className="trend-up">↗</span>
          </div>
          <div className="crm-metric-value-col">
            <span className="crm-metric-label">Conversion Rate</span>
            <strong>{stats.conversionRate}%</strong>
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <div className="crm-icon-box purple-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            {metrics.averageResponseTimeMs > 0 && <span className="trend-down">↓</span>}
          </div>
          <div className="crm-metric-value-col">
            <span className="crm-metric-label">Avg. Response Time</span>
            <strong>{metrics.averageResponseTimeMs > 0 ? (metrics.averageResponseTimeMs / 1000).toFixed(1) : "0.0"}s</strong>
          </div>
        </div>

        <div className="crm-metric-card border-orange">
          <div className="crm-metric-head">
            <div className="crm-icon-box orange">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.5 2.5l7 7-1.5 1.5-7-7z"/><path d="M4.5 19.5l7-7-1.5-1.5-7 7z"/><path d="M9 15l-6 6 2 2 6-6"/><circle cx="16.5" cy="7.5" r="2.5"/></svg>
            </div>
            <span className="trend-excellent">{metrics.underThreeSecondsRate >= 90 ? "Excellent" : "Good"}</span>
          </div>
          <div className="crm-metric-value-col">
            <span className="crm-metric-label">3s Speed Tracker</span>
            <strong>{metrics.underThreeSecondsRate || 0}%</strong>
          </div>
        </div>
      </section>

      {/* ── Main Charts Row ── */}
      <section className="crm-charts-row">
        <div className="crm-chart-card large">
          <div className="crm-chart-head">
            <h3>Lead Volume &amp; Conversion</h3>
            <span className="crm-time-toggle">Last 30 Days</span>
          </div>
          <div className="crm-bar-chart-mock">
            {weekData.length > 0 ? (
              weekData.map((v, i) => (
                <div
                  key={i}
                  className={`crm-chart-bar ${i === weekData.length - 1 ? "active" : ""}`}
                  style={{ height: `${Math.max(5, (v / maxWeek) * 100)}%` }}
                ></div>
              ))
            ) : (
              [4, 6, 8, 12].map((v, i) => (
                <div key={i} className="crm-chart-bar" style={{ height: `${v * 8}%` }}></div>
              ))
            )}
            <div className="crm-chart-x-axis">
              <span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span>
            </div>
          </div>
        </div>

        <div className="crm-chart-card">
          <div className="crm-chart-head">
            <h3>Lead Quality Distribution</h3>
          </div>
          <div className="crm-doughnut-mock">
            <div className="crm-doughnut-ring">
              <div className="crm-doughnut-inner">
                <strong>{stats.totalLeads > 0 ? stats.totalLeads.toLocaleString() : "0"}</strong>
                <span>TOTAL</span>
              </div>
            </div>
            <div className="crm-doughnut-legend">
              <div className="legend-row"><span className="dot orange"></span> Hot Leads <strong>{hotPct}%</strong></div>
              <div className="legend-row"><span className="dot yellow"></span> Warm Leads <strong>{warmPct}%</strong></div>
              <div className="legend-row"><span className="dot gray"></span> Cold Leads <strong>{coldPct}%</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Details Row ── */}
      <section className="crm-details-row">
        <div className="crm-detail-card">
          <div className="crm-chart-head">
            <h3>Lead Sources Performance</h3>
            <Link href={"/admin/leads" as any} className="crm-link-text">View All →</Link>
          </div>
          <div className="crm-sources-list">
            {sortedSources.length > 0 ? (
              sortedSources.map(([sourceLabel, count], i) => (
                <div key={sourceLabel} className="source-item">
                  <div className={`source-icon ${sourceColors[i % sourceColors.length]}`}>
                    {sourceLabel.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="source-info">
                    <div className="src-top"><strong>{sourceLabel}</strong><span>{count} leads</span></div>
                    <div className="src-bar-bg"><div className={`src-bar-fill bg-${sourceColors[i % sourceColors.length]}`} style={{ width: `${(count / maxSourceCount) * 100}%` }}></div></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="source-item">
                  <div className="source-icon blue">WF</div>
                  <div className="source-info">
                    <div className="src-top"><strong>Website Form</strong><span>0 leads</span></div>
                    <div className="src-bar-bg"><div className="src-bar-fill bg-blue" style={{ width: "0%" }}></div></div>
                  </div>
                </div>
                <div className="source-item">
                  <div className="source-icon orange">CB</div>
                  <div className="source-info">
                    <div className="src-top"><strong>Chatbot</strong><span>0 leads</span></div>
                    <div className="src-bar-bg"><div className="src-bar-fill bg-orange" style={{ width: "0%" }}></div></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="crm-speed-tracker-card active-card">
          <div className="crm-chart-head invert">
            <h3>3s Speed Tracker</h3>
            <span className="live-badge">LIVE FEED</span>
          </div>
          <p className="tracker-copy">
            Your response speed is in the top 5% of all brokers in the network. Fast responses result in a <strong>42% higher conversion rate</strong> on average.
          </p>
          <div className="tracker-stats-grid">
            <div className="tracker-stat">
              <span>PROCESSED</span>
              <strong>{metrics.processedMessages}</strong>
            </div>
            <div className="tracker-stat">
              <span>UNDER 3S RATIO</span>
              <strong>{metrics.underThreeSecondsRate || 0}%</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
