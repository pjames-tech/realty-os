import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

const CLIENT_SESSION_COOKIE = "realtyos_client_session";

// ─── Admin/Agent auth (Supabase Auth) ────────────────────

/**
 * Get the current admin/agent session from Supabase Auth.
 * Returns the Agent record if authenticated, null otherwise.
 */
export async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const agent = await db.agent.findUnique({
    where: { supabaseUserId: user.id },
  });

  return agent;
}

/**
 * Require admin/agent authentication. Throws a response-ready object on failure.
 */
export async function requireAdmin() {
  const agent = await getAdminSession();
  if (!agent) {
    throw new AuthError("Unauthorized", 401);
  }
  return agent;
}

// ─── Client auth (custom JWT-free cookie auth) ───────────

/**
 * Get the current client session from the signed cookie.
 * Returns the Lead record if authenticated, null otherwise.
 */
export async function getClientSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(CLIENT_SESSION_COOKIE);

  if (!sessionCookie?.value) return null;

  // The cookie value is a signed token: leadId:signature
  const leadId = parseClientToken(sessionCookie.value);
  if (!leadId) return null;

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  return lead;
}

/**
 * Require client authentication.
 */
export async function requireClient() {
  const lead = await getClientSession();
  if (!lead) {
    throw new AuthError("Unauthorized", 401);
  }
  return lead;
}

/**
 * Sign in a client by verifying email + password, then setting a session cookie.
 */
export async function signInClient(email: string, password: string) {
  const lead = await db.lead.findFirst({
    where: { email: email.trim().toLowerCase() },
  });

  if (!lead || !lead.password) return null;

  const valid = await bcrypt.compare(password, lead.password);
  if (!valid) return null;

  // Set the session cookie
  const token = createClientToken(lead.id);
  const cookieStore = await cookies();
  cookieStore.set(CLIENT_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return lead;
}

/**
 * Sign out the current client by clearing the session cookie.
 */
export async function signOutClient() {
  const cookieStore = await cookies();
  cookieStore.set(CLIENT_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Set a client session cookie after signup.
 */
export async function setClientSession(leadId: string) {
  const token = createClientToken(leadId);
  const cookieStore = await cookies();
  cookieStore.set(CLIENT_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

// ─── Client token helpers ────────────────────────────────
// Simple HMAC-signed token: leadId.signature
// In production, consider using jose or similar JWT library.

function getClientSecret(): string {
  const secret = process.env.CLIENT_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("CLIENT_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set");
  return secret;
}

function createClientToken(leadId: string): string {
  // Use a simple approach: base64(leadId):hmac
  const crypto = require("crypto") as typeof import("crypto");
  const secret = getClientSecret();
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(leadId)
    .digest("hex")
    .slice(0, 16);
  return `${leadId}.${hmac}`;
}

function parseClientToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [leadId, signature] = parts;
  const crypto = require("crypto") as typeof import("crypto");
  const secret = getClientSecret();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(leadId)
    .digest("hex")
    .slice(0, 16);

  if (signature !== expected) return null;
  return leadId;
}

// ─── Auth error class ────────────────────────────────────

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export { CLIENT_SESSION_COOKIE };
