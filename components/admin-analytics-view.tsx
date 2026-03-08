"use client";

import { useEffect, useState } from "react";

type Metrics = {
  processedMessages: number;
  averageResponseTimeMs: number;
  maxResponseTimeMs: number;
  underThreeSecondsRate: number;
};

const emptyMetrics: Metrics = {
  processedMessages: 0,
  averageResponseTimeMs: 0,
  maxResponseTimeMs: 0,
  underThreeSecondsRate: 0
};

export function AdminAnalyticsView() {
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);

  useEffect(() => {
    void fetch("/api/metrics", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setMetrics(payload || emptyMetrics));
  }, []);

  return (
    <section className="settings-grid">
      <article className="settings-card">
        <div className="section-head">
          <div>
            <span className="section-kicker">Latency</span>
            <h2>Response performance</h2>
          </div>
        </div>
        <div className="analytics-list">
          <div>
            <span>Average response</span>
            <strong>{metrics.averageResponseTimeMs} ms</strong>
          </div>
          <div>
            <span>Max response</span>
            <strong>{metrics.maxResponseTimeMs} ms</strong>
          </div>
          <div>
            <span>Under 3 seconds</span>
            <strong>{metrics.underThreeSecondsRate}%</strong>
          </div>
          <div>
            <span>Processed</span>
            <strong>{metrics.processedMessages}</strong>
          </div>
        </div>
      </article>
    </section>
  );
}
