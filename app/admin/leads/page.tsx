import { AdminLeadsView } from "@/components/admin-leads-view";
import { AdminShell } from "@/components/admin-shell";

export default function AdminLeadsPage() {
  return (
    <AdminShell
      title="Leads"
      description="Review all leads captured by the qualification system."
    >
      <AdminLeadsView />
    </AdminShell>
  );
}
