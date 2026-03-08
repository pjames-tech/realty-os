import { AdminAnalyticsView } from "@/components/admin-analytics-view";
import { AdminShell } from "@/components/admin-shell";

export default function AdminAnalyticsPage() {
  return (
    <AdminShell
      title="Analytics"
      description="Track latency, throughput, and qualification performance."
    >
      <AdminAnalyticsView />
    </AdminShell>
  );
}
