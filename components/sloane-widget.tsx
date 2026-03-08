"use client";

import type { Route } from "next";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type AssistantAction = {
  label: string;
  href: string;
};

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
  actions?: AssistantAction[];
};

const starterMessages: AssistantMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I am Sloane. I can answer questions about homes, guide your next step, and take you directly where you need to go.",
    actions: [
      { label: "Start Inquiry", href: "/inquiry" },
      { label: "Client Access", href: "/portal/login" }
    ]
  }
];

export function SloaneWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(starterMessages);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || sending) {
      return;
    }

    const userMessage: AssistantMessage = {
      role: "user",
      content: input.trim()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/sloane/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPath: pathname,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content
          }))
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Assistant error");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            payload.reply ||
            "I can help with location, budget, booking, and where to click next.",
          actions: Array.isArray(payload.actions) ? payload.actions : undefined
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I am having trouble right now. You can still start from Get Started or Client Access."
        }
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleAction(href: string) {
    setOpen(false);
    router.push(href as Route);
  }

  return (
    <div className={`sloane-layer ${open ? "sloane-layer-open" : ""}`}>
      {open ? (
        <section className="sloane-panel">
          <header className="sloane-head">
            <div>
              <strong>Sloane</strong>
              <span>Smart Property Assistant</span>
            </div>
            <button
              className="sloane-close"
              onClick={() => setOpen(false)}
              type="button"
            >
              Close
            </button>
          </header>

          <div className="sloane-feed">
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`sloane-message ${
                  message.role === "assistant"
                    ? "sloane-message-assistant"
                    : "sloane-message-user"
                }`}
              >
                <span>{message.role === "assistant" ? "Sloane" : "You"}</span>
                <p>{message.content}</p>
                {message.actions && message.actions.length > 0 ? (
                  <div className="sloane-actions">
                    {message.actions.map((action) => (
                      <button
                        key={`${action.href}-${action.label}`}
                        onClick={() => handleAction(action.href)}
                        type="button"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <form className="sloane-form" onSubmit={handleSubmit}>
            <input
              placeholder="Ask Sloane anything about your home search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="sloane-send" disabled={sending} type="submit">
              {sending ? "..." : "Send"}
            </button>
          </form>
        </section>
      ) : null}

      <button
        className="sloane-fab"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="sloane-fab-icon" />
        <span>Sloane</span>
      </button>
    </div>
  );
}
