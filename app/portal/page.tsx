import { ClientDashboard } from "@/components/client-dashboard";
import { PortalShell } from "@/components/portal-shell";

export default function ClientPortalPage() {
  return (
    <PortalShell>
      <ClientDashboard />
    </PortalShell>
  );
}
