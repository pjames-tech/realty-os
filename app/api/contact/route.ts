import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  // In production, wire to an email service (Resend, Postmark, SendGrid, etc.)
  // For now, log the submission so it's visible in server logs.
  console.log("[contact] New submission:", {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, message: "Thanks! We'll get back to you within 24 hours." });
}
