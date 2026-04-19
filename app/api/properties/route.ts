import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-config";
import { propertyCreateSchema, propertySearchSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = propertySearchSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 400 });
  }

  const { q, city, minPrice, maxPrice, minBeds, type, status, take, skip } = parsed.data;

  const where: Prisma.PropertyWhereInput = {
    status: status ?? "active",
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (type) where.type = type;
  if (minBeds !== undefined) where.beds = { gte: minBeds };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const [properties, total] = await Promise.all([
    db.property.findMany({
      where,
      include: {
        agent: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: take ?? 24,
      skip: skip ?? 0,
    }),
    db.property.count({ where }),
  ]);

  return NextResponse.json({ properties, total });
}

export async function POST(req: NextRequest) {
  const agent = await getAdminSession();
  if (!agent) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = propertyCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const property = await db.property.create({
    data: {
      ...parsed.data,
      agentId: agent.id,
    },
  });

  return NextResponse.json({ property }, { status: 201 });
}
