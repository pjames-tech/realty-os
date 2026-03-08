import { AdminShell } from "@/components/admin-shell";
import { ThemeSettings } from "@/components/theme-settings";

export default function AdminSettingsPage() {
  return (
    <AdminShell
      title="Settings"
      description="Configure dashboard preferences and interface behavior."
    >
      <ThemeSettings />
    </AdminShell>
  );
}
