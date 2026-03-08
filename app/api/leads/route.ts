import { NextResponse } from "next/server";
import { readState } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const state = await readState();
  const leads = Object.values(state.leads).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return NextResponse.json({ leads });
}
