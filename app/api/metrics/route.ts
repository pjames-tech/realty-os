import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const metrics = await db.metrics.findUnique({ where: { id: "global" } });

  const processed = metrics?.processedMessages ?? 0;
  const averageResponseTimeMs =
    processed > 0
      ? Number(((metrics?.totalResponseTimeMs ?? 0) / processed).toFixed(2))
      : 0;
  const underThreeSecondsRate =
    processed > 0
      ? Number((((metrics?.underThreeSeconds ?? 0) / processed) * 100).toFixed(1))
      : 0;

  return NextResponse.json({
    processedMessages: processed,
    averageResponseTimeMs,
    maxResponseTimeMs: metrics?.maxResponseTimeMs ?? 0,
    underThreeSecondsRate,
  });
}
