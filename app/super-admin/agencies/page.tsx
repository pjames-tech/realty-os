import { SuperAdminShell } from "@/components/super-admin-shell";
import { SuperAdminAgenciesList } from "@/components/super-admin-agencies-list";

export default function SuperAdminAgenciesPage() {
  return (
    <SuperAdminShell>
      <SuperAdminAgenciesList />
    </SuperAdminShell>
  );
}
