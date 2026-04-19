import { NextResponse } from "next/server";
import { requireClient } from "@/lib/auth-config";
import { getLeadById } from "@/lib/db-helpers";
import { prismaLeadToLeadRecord } from "@/lib/db-mappers";
import { AuthError } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function GET() {
  try {
    const clientLead = await requireClient();

    const fullLead = await getLeadById(clientLead.id);
    if (!fullLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead: prismaLeadToLeadRecord(fullLead) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
