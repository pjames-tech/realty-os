import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function GET() {
  const agent = await getAdminSession();

  if (!agent || agent.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    name: agent.name,
    email: agent.email,
    role: agent.role,
  });
}
