import { SuperAdminShell } from "@/components/super-admin-shell";
import { SuperAdminSettings } from "@/components/super-admin-settings";

export default function SuperAdminSettingsPage() {
  return (
    <SuperAdminShell>
      <SuperAdminSettings />
    </SuperAdminShell>
  );
}
