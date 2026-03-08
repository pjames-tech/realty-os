import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminShell } from "@/components/admin-shell";

export default function AdminPage() {
  return (
    <AdminShell
      title="Dashboard"
      description="Overview of live lead qualification, booking, and response performance."
    >
      <AdminDashboard />
    </AdminShell>
  );
}
