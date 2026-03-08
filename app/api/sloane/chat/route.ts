import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type InboundMessage = {
  role: "user" | "assistant";
  content: string;
};

type Action = {
  label: string;
  href: string;
};

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const allowedHrefs = ["/", "/inquiry", "/portal/login", "/portal", "/admin/login"];

export async function POST(request: NextRequest) {
  let payload: { currentPath?: string; messages?: InboundMessage[] };
  try {
    payload = (await request.json()) as {
      currentPath?: string;
      messages?: InboundMessage[];
    };
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const messages = Array.isArray(payload.messages) ? payload.messages.slice(-10) : [];
  const currentPath = payload.currentPath || "/";

  if (messages.length === 0) {
    return NextResponse.json({
      reply:
        "I can help you with home search questions, budgeting, timelines, and exactly where to click next.",
      actions: [{ label: "Start Inquiry", href: "/inquiry" }]
    });
  }

  if (!openai) {
    return NextResponse.json(fallbackResponse(messages[messages.length - 1].content));
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are Sloane, a smart assistant for RealtyOS.",
            "Your job is to answer client questions clearly and guide them to the right click path.",
            "Return JSON only with the following shape:",
            '{ "reply": string, "actions": [{ "label": string, "href": string }] }',
            "Allowed href values: /, /inquiry, /portal/login, /portal, /admin/login.",
            "Only include actions when useful.",
            "If user asks where to go, provide direct action buttons.",
            `Current path: ${currentPath}`
          ].join("\n")
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      ]
    });

    const content = response.choices[0]?.message?.content?.trim() || "";
    if (!content) {
      return NextResponse.json(fallbackResponse(messages[messages.length - 1].content));
    }

    const parsed = JSON.parse(content) as {
      reply?: string;
      actions?: Action[];
    };

    const cleanActions = Array.isArray(parsed.actions)
      ? parsed.actions
          .filter(
            (action) =>
              typeof action.label === "string" &&
              typeof action.href === "string" &&
              allowedHrefs.includes(action.href)
          )
          .slice(0, 3)
      : [];

    return NextResponse.json({
      reply:
        (typeof parsed.reply === "string" && parsed.reply.trim()) ||
        "I can guide you through your inquiry and show you exactly where to click next.",
      actions: cleanActions
    });
  } catch {
    return NextResponse.json(fallbackResponse(messages[messages.length - 1].content));
  }
}

function fallbackResponse(userInput: string): { reply: string; actions: Action[] } {
  const text = userInput.toLowerCase();

  if (text.includes("admin")) {
    return {
      reply:
        "If you are a real estate agent and need the operations dashboard, go to the admin login.",
      actions: [{ label: "Admin Login", href: "/admin/login" }]
    };
  }

  if (text.includes("track") || text.includes("status") || text.includes("portal")) {
    return {
      reply:
        "To track your current request, use the client portal with your email or phone number.",
      actions: [{ label: "Client Access", href: "/portal/login" }]
    };
  }

  if (
    text.includes("budget") ||
    text.includes("location") ||
    text.includes("where") ||
    text.includes("start")
  ) {
    return {
      reply:
        "The best next step is to open the inquiry page and share your preferences. I can help you fill each step.",
      actions: [{ label: "Start Inquiry", href: "/inquiry" }]
    };
  }

  return {
    reply:
      "I can help with budget, location, timeline, property type, and where to click next. Start inquiry when you are ready.",
    actions: [{ label: "Start Inquiry", href: "/inquiry" }]
  };
}
