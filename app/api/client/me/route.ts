import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CLIENT_SESSION_COOKIE } from "@/lib/auth";
import { readState } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const leadId = (await cookies()).get(CLIENT_SESSION_COOKIE)?.value;
  if (!leadId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = await readState();
  const lead = state.leads[leadId];
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
