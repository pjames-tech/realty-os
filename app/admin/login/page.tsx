import { AdminLogin } from "@/components/admin-login";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AdminLogin nextUrl={params?.next || "/admin"} />;
}
