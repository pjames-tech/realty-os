import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-config";

export const runtime = "nodejs";

export async function GET() {
  const agent = await getAdminSession();
  if (!agent || agent.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    agentGroups,
    totalAgents,
    totalLeads,
    bookedLeads,
    qualifiedLeads,
    activeListings,
    recentLeads,
    recentListings,
    recentBookings,
    metrics,
    newLeadsLast30,
  ] = await Promise.all([
    db.agent.findMany({
      select: { organizationName: true, role: true },
    }),
    db.agent.count(),
    db.lead.count(),
    db.lead.count({ where: { status: "booked" } }),
    db.lead.count({ where: { status: { in: ["qualified", "booked"] } } }),
    db.property.count({ where: { status: "active" } }),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    }),
    db.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, price: true, city: true, createdAt: true },
    }),
    db.appointment.findMany({
      take: 5,
      orderBy: { bookedAt: "desc" },
      include: { lead: { select: { name: true, email: true } } },
    }),
    db.metrics.findUnique({ where: { id: "global" } }),
    db.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const organizations = new Set(
    agentGroups
      .map((a) => a.organizationName)
      .filter((name): name is string => !!name)
  );

  const conversionRate = totalLeads > 0 ? (bookedLeads / totalLeads) * 100 : 0;
  const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
  const avgResponseTimeMs =
    metrics && metrics.processedMessages > 0
      ? metrics.totalResponseTimeMs / metrics.processedMessages
      : 0;
  const under3sRate =
    metrics && metrics.processedMessages > 0
      ? (metrics.underThreeSeconds / metrics.processedMessages) * 100
      : 0;

  return NextResponse.json({
    stats: {
      totalAgencies: organizations.size,
      totalAgents,
      totalLeads,
      bookedLeads,
      qualifiedLeads,
      activeListings,
      newLeadsLast30,
      conversionRate,
      qualificationRate,
      avgResponseTimeMs,
      under3sRate,
      processedMessages: metrics?.processedMessages ?? 0,
    },
    recentActivity: {
      leads: recentLeads,
      listings: recentListings,
      bookings: recentBookings,
    },
  });
}
