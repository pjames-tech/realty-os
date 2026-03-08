import { AdminScheduleView } from "@/components/admin-schedule-view";
import { AdminShell } from "@/components/admin-shell";

export default function AdminSchedulePage() {
  return (
    <AdminShell
      title="Schedule"
      description="View bookings generated from qualified leads."
    >
      <AdminScheduleView />
    </AdminShell>
  );
}
