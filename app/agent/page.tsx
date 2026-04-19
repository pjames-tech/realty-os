import { AgentDashboard } from "@/components/agent-dashboard";
import { AgentShell } from "@/components/agent-shell";

export default function AgentPage() {
  return (
    <AgentShell
      title="Agent Dashboard"
      description="Overview of your assigned leads, tasks, and recent conversations."
    >
      <AgentDashboard />
    </AgentShell>
  );
}
