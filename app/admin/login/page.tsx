import { AdminLogin } from "@/components/admin-login";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams?: { next?: string };
}) {
  return <AdminLogin nextUrl={searchParams?.next || "/admin"} />;
}
