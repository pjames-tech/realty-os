import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-config";
import { propertyUpdateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await db.property.findUnique({
    where: { id },
    include: {
      agent: { select: { id: true, name: true, email: true, organizationName: true } },
    },
  });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = await getAdminSession();
  if (!agent) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = existing.agentId === agent.id;
  const canEdit = isOwner || agent.role === "ORG_ADMIN" || agent.role === "SUPER_ADMIN";
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = propertyUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const property = await db.property.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ property });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = await getAdminSession();
  if (!agent) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = existing.agentId === agent.id;
  const canDelete = isOwner || agent.role === "ORG_ADMIN" || agent.role === "SUPER_ADMIN";
  if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.property.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
