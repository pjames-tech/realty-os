import { AdminShell } from "@/components/admin-shell";
import { AdminListingsView } from "@/components/admin-listings-view";

export default function AdminListingsPage() {
  return (
    <AdminShell title="Listings" description="Manage your property inventory">
      <AdminListingsView />
    </AdminShell>
  );
}
