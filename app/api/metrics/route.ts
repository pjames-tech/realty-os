import { NextResponse } from "next/server";
import { readState } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const state = await readState();
  const processed = state.metrics.processedMessages;
  const averageResponseTimeMs =
    processed > 0
      ? Number((state.metrics.totalResponseTimeMs / processed).toFixed(2))
      : 0;
  const underThreeSecondsRate =
    processed > 0
      ? Number(((state.metrics.underThreeSeconds / processed) * 100).toFixed(1))
      : 0;

  return NextResponse.json({
    processedMessages: processed,
    averageResponseTimeMs,
    maxResponseTimeMs: state.metrics.maxResponseTimeMs,
    underThreeSecondsRate
  });
}
