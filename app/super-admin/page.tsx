import { SuperAdminShell } from "@/components/super-admin-shell";
import { SuperAdminDashboard } from "@/components/super-admin-dashboard";

export default function SuperAdminPage() {
  return (
    <SuperAdminShell>
      <SuperAdminDashboard />
    </SuperAdminShell>
  );
}
