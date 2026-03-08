import { NextRequest, NextResponse } from "next/server";
import { markLeadBooked } from "@/lib/booking";
import { deriveTags } from "@/lib/domain";
import { mutateState } from "@/lib/store";
import { BookingPayload } from "@/lib/types";

export const runtime = "nodejs";

type Context = {
  params: { leadId: string };
};

export async function POST(req: NextRequest, context: Context) {
  let payload: BookingPayload = {};
  try {
    payload = (await req.json()) as BookingPayload;
  } catch {
    payload = {};
  }

  const result = await mutateState((state) => {
    const existing = state.leads[context.params.leadId];
    if (!existing) {
      return null;
    }

    const next = markLeadBooked(existing, payload.slot);
    next.tags = deriveTags(next);
    state.leads[next.id] = next;
    return next;
  });

  if (!result) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead: result });
}
