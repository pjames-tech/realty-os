import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { deriveTags, generateId, nowIso } from "@/lib/domain";
import { LeadRecord, Metrics, RealtyState } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "state.json");

const DEFAULT_METRICS: Metrics = {
  processedMessages: 0,
  totalResponseTimeMs: 0,
  maxResponseTimeMs: 0,
  underThreeSeconds: 0
};

let stateCache: RealtyState | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function defaultState(): RealtyState {
  return {
    leads: {},
    metrics: { ...DEFAULT_METRICS }
  };
}

async function ensureLoaded(): Promise<RealtyState> {
  if (stateCache) return stateCache;

  if (!existsSync(DATA_FILE)) {
    stateCache = defaultState();
    return stateCache;
  }

  try {
    const raw = await readFile(DATA_FILE, "utf8");
    if (!raw.trim()) {
      stateCache = defaultState();
      return stateCache;
    }
    const parsed = JSON.parse(raw) as RealtyState;
    stateCache = {
      leads: parsed.leads || {},
      metrics: { ...DEFAULT_METRICS, ...(parsed.metrics || {}) }
    };
  } catch {
    stateCache = defaultState();
  }

  return stateCache;
}

async function persist(state: RealtyState): Promise<void> {
  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      await mkdir(path.dirname(DATA_FILE), { recursive: true });
      await writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
    });
  await writeQueue;
}

export async function readState(): Promise<RealtyState> {
  return ensureLoaded();
}

export async function mutateState<T>(
  updater: (state: RealtyState) => T | Promise<T>
): Promise<T> {
  const state = await ensureLoaded();
  const result = await updater(state);
  await persist(state);
  return result;
}

export function createLead(input: {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
}): LeadRecord {
  const timestamp = nowIso();
  const lead: LeadRecord = {
    id: generateId("lead"),
    name: input.name,
    email: input.email,
    phone: input.phone,
    source: input.source || "website-form",
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "new",
    tags: [],
    qualification: {
      confidence: 0,
      missingFields: ["budget", "timeline", "location", "propertyType"]
    },
    conversation: []
  };
  lead.tags = deriveTags(lead);
  return lead;
}

export function appendConversation(
  lead: LeadRecord,
  role: "user" | "assistant",
  content: string
): LeadRecord {
  const next = { ...lead };
  next.conversation = [
    ...next.conversation,
    {
      id: generateId("msg"),
      role,
      content,
      timestamp: nowIso()
    }
  ];
  next.updatedAt = nowIso();
  return next;
}

export function trackResponseMetrics(
  state: RealtyState,
  responseTimeMs: number
): void {
  state.metrics.processedMessages += 1;
  state.metrics.totalResponseTimeMs += responseTimeMs;
  state.metrics.maxResponseTimeMs = Math.max(
    state.metrics.maxResponseTimeMs,
    responseTimeMs
  );
  if (responseTimeMs <= 3000) {
    state.metrics.underThreeSeconds += 1;
  }
}
