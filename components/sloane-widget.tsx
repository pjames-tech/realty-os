"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Route } from "next";
import { Icon } from "./icons";

type ViewState = "closed" | "welcome" | "chat";
type ChatMode = "lead" | "ai" | null;
type LeadStep = "name" | "email" | "budget" | "timeline" | "location";

type AssistantAction = {
  label: string;
  href: string;
};

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
  actions?: AssistantAction[];
};

export function SloaneWidget() {
  const [viewState, setViewState] = useState<ViewState>("closed");
  const [mode, setMode] = useState<ChatMode>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [leadStep, setLeadStep] = useState<LeadStep>("name");
  const [leadAnswers, setLeadAnswers] = useState<Record<string, string>>({});
  
  const pathname = usePathname();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoOpenTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Page-context logic ──
  const isLanding = pathname === "/";
  const isInquiry = pathname?.startsWith("/inquiry");
  const isAgentDash = pathname?.startsWith("/agent");
  const isAdminDash = pathname?.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/register";
  const isPortal = pathname?.startsWith("/portal");

  const contextLabel = isLanding ? "RealtyOS Sales Assistant"
    : isInquiry ? "Smart Property Assistant"
    : isAgentDash ? "Agent CRM Helper"
    : isAdminDash ? "Admin Assistant"
    : isPortal ? "Your Property Concierge"
    : "Smart Property Assistant";

  const welcomeGreeting = isLanding
    ? "Want to see how RealtyOS can 10x your lead pipeline?"
    : isInquiry ? "I'm Sloane, your virtual real estate assistant. How can I help you today?"
    : isAgentDash ? "Need help navigating your dashboard or managing leads?"
    : isAdminDash ? "I can help you with team management, lead routing, or analytics."
    : isPortal ? "I'm here to help you with your property search and appointments."
    : "I'm Sloane, your virtual real estate assistant. How can I help you today?";

  const aiChatGreeting = isLanding
    ? "Hi! I'm Sloane, the AI that powers RealtyOS. Ask me anything about how our platform helps agents close more deals."
    : isInquiry ? "Hi! I am Sloane. How can I help you find your next home?"
    : isAgentDash ? "Hi! I can help you manage your leads, understand your metrics, or walk you through features. What do you need?"
    : isAdminDash ? "Hi! I can assist with team management, lead assignment, or platform settings. What would you like help with?"
    : isPortal ? "Hi! I can help you explore properties, check appointment status, or message your agent. What do you need?"
    : "Hi! I am Sloane. How can I help you find your next home?";

  // Load state from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("sloane-state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setViewState(parsed.viewState || "closed");
        setMode(parsed.mode || null);
        setMessages(parsed.messages || []);
        setLeadStep(parsed.leadStep || "name");
        setLeadAnswers(parsed.leadAnswers || {});
      } catch (err) {
        console.error("Failed to parse sloane state", err);
      }
    }
  }, []);

  // Auto-open logic: only on landing page, only on first visit
  useEffect(() => {
    if (pathname === "/") {
      const hasPopped = localStorage.getItem("sloane-has-popped");
      if (!hasPopped) {
        autoOpenTimeout.current = setTimeout(() => {
          setViewState((curr) => {
            if (curr === "closed") {
              localStorage.setItem("sloane-has-popped", "true");
              return "welcome";
            }
            return curr;
          });
        }, 3000); // 3 seconds is standard for homepage greetings
      }
    }
    return () => {
      if (autoOpenTimeout.current) clearTimeout(autoOpenTimeout.current);
    };
  }, [pathname]);

  // Save state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("sloane-state", JSON.stringify({
      viewState,
      mode,
      messages,
      leadStep,
      leadAnswers
    }));
  }, [viewState, mode, messages, leadStep, leadAnswers]);

  // Click outside to close
  useEffect(() => {
    if (viewState === "closed") return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setViewState("closed");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [viewState]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, viewState]);

  function handleRestart() {
    setMode(null);
    setMessages([]);
    setLeadStep("name");
    setLeadAnswers({});
    setViewState("welcome");
    sessionStorage.removeItem("sloane-state");
  }

  function startLeadCapture() {
    clearTimeout(autoOpenTimeout.current!);
    setMode("lead");
    setViewState("chat");
    setMessages([
      { role: "assistant", content: "Great! Let's get started. What is your full name?" }
    ]);
  }

  function startDemo() {
    clearTimeout(autoOpenTimeout.current!);
    setMode("ai");
    setViewState("chat");
    const demoMessages: AssistantMessage[] = [
      { role: "assistant", content: "Welcome to the RealtyOS demo! Let me show you how Sloane qualifies a lead in under 60 seconds." },
    ];
    setMessages(demoMessages);

    const sequence: AssistantMessage[] = [
      { role: "user", content: "Hi, I'm looking for a 3-bedroom home in Austin." },
      { role: "assistant", content: "Great choice! Austin's market is moving fast. What's your approximate budget range?" },
      { role: "user", content: "Around $450,000" },
      { role: "assistant", content: "Perfect. And what's your timeline — are you looking to move in the next 30 days, 60 days, or longer?" },
      { role: "user", content: "Within the next 2 months" },
      { role: "assistant", content: "Lead qualified. Here is the summary:\n\n• **Location:** Austin, TX\n• **Budget:** $450,000\n• **Timeline:** 30-60 days\n• **Type:** 3BR Home\n• **Score:** 92/100\n\nThis lead is now tagged as **Hot** and pushed to the agent's CRM automatically." },
    ];

    let i = 0;
    const playNext = () => {
      if (i < sequence.length) {
        const msg = sequence[i];
        i++;
        setMessages(prev => [...prev, msg]);
        setTimeout(playNext, msg.role === "user" ? 1200 : 2000);
      }
    };
    setTimeout(playNext, 1500);
  }

  function startAIChat() {
    clearTimeout(autoOpenTimeout.current!);
    setMode("ai");
    setViewState("chat");
    setMessages([
      { role: "assistant", content: aiChatGreeting }
    ]);
  }

  function toggleOpen() {
    clearTimeout(autoOpenTimeout.current!);
    setViewState((curr) => {
      if (curr === "closed") {
        return mode ? "chat" : "welcome";
      }
      return "closed";
    });
  }

  async function handleAISubmit(userMessage: AssistantMessage, nextMessages: AssistantMessage[]) {
    try {
      const response = await fetch("/api/sloane/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPath: pathname,
          messages: nextMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.reply || "I'm here to help.",
          actions: Array.isArray(payload.actions) ? payload.actions : undefined
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I'm having trouble connecting right now." }
      ]);
    } finally {
      setSending(false);
    }
  }

  async function handleLeadSubmit(userText: string, nextMessages: AssistantMessage[]) {
    const updatedAnswers = { ...leadAnswers, [leadStep]: userText };
    setLeadAnswers(updatedAnswers);

    let nextStepMessage = "";
    let nextStep: LeadStep | "done" = "name";

    switch (leadStep) {
      case "name":
        nextStep = "email";
        nextStepMessage = `Nice to meet you, ${userText}. What is your best email?`;
        break;
      case "email":
        nextStep = "budget";
        nextStepMessage = "Thanks. What is your approximate budget for a property?";
        break;
      case "budget":
        nextStep = "timeline";
        nextStepMessage = "Got it. When are you looking to move or purchase?";
        break;
      case "timeline":
        nextStep = "location";
        nextStepMessage = "And finally, what location or area are you interested in?";
        break;
      case "location":
        nextStep = "done";
        nextStepMessage = "Perfect! I've sent this to our team. An agent will reach out soon. You can continue chatting with me if you have any questions.";
        break;
    }

    if (nextStep !== "done") {
      setLeadStep(nextStep as LeadStep);
      setMessages([...nextMessages, { role: "assistant", content: nextStepMessage }]);
      setSending(false);
    } else {
      // Switch to AI mode after completion
      try {
        await fetch("/api/leads/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updatedAnswers.name,
            email: updatedAnswers.email,
            message: `Lead generated via chatbot. Budget: ${updatedAnswers.budget}, Timeline: ${updatedAnswers.timeline}, Location: ${updatedAnswers.location}`
          })
        });
      } catch (err) {
        console.error("Lead submission failed", err);
      }

      setMode("ai");
      setMessages([
        ...nextMessages,
        { role: "assistant", content: nextStepMessage }
      ]);
      setSending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || sending) return;

    const userText = input.trim();
    const userMessage: AssistantMessage = { role: "user", content: userText };
    const nextMessages = [...messages, userMessage];
    
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    if (mode === "ai") {
      await handleAISubmit(userMessage, nextMessages);
    } else if (mode === "lead") {
      await handleLeadSubmit(userText, nextMessages);
    }
  }

  return (
    <div className="sloane-widget-container" ref={containerRef}>
      <AnimatePresence>
        {viewState !== "closed" && (
          <motion.section
            className="sloane-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <header className="sloane-header">
              <div className="sloane-header-left">
                <div className="sloane-avatar-circle">
                  <Image src="/sloane-avatar.png" alt="Sloane" width={40} height={40} />
                </div>
                <div className="sloane-header-text">
                  <strong>Sloane</strong>
                  <span><span className="sloane-status-dot"></span> {contextLabel}</span>
                </div>
              </div>
              <div className="sloane-header-actions">
                {viewState === "chat" && (
                  <button className="sloane-icon-btn" onClick={() => setViewState("welcome")} title="Back">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                )}
                <button className="sloane-icon-btn" onClick={handleRestart} title="Restart">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button className="sloane-icon-btn" onClick={() => setViewState("closed")} title="Close">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </header>

            {viewState === "welcome" && (
              <motion.div 
                className="sloane-welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="sloane-welcome-avatar">
                  <Image src="/sloane-avatar.png" alt="Sloane" width={80} height={80} />
                </div>
                <div>
                  <h3>Hey there</h3>
                  <p>{welcomeGreeting}</p>
                </div>
                <div className="sloane-mode-btns">
                  {(isInquiry || isPortal || isLanding) && (
                    <button className="sloane-mode-btn" onClick={isLanding ? startDemo : startLeadCapture}>
                      <span style={{ display: "inline-flex", alignItems: "center" }} aria-hidden="true"><Icon.Home size={16} /></span> {isLanding ? "See a Demo" : "Find a Property"}
                    </button>
                  )}
                  <button className="sloane-mode-btn" onClick={startAIChat}>
                    <span style={{ display: "inline-flex", alignItems: "center" }} aria-hidden="true"><Icon.Message size={16} /></span> {isLanding ? "Ask About RealtyOS" : isAgentDash || isAdminDash ? "Get Help" : "Ask a Question"}
                  </button>
                </div>
              </motion.div>
            )}

            {viewState === "chat" && (
              <motion.div 
                className="sloane-chat-area"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="sloane-mode-indicator">
                  <span className="sloane-mode-pill">
                    {mode === "lead" ? "Property Inquiry" : "AI Assistant"}
                  </span>
                </div>
                
                <div className="sloane-messages">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`sloane-bubble-wrap ${message.role === "assistant" ? "sloane-bubble-assistant" : "sloane-bubble-user"}`}
                    >
                      <div className="sloane-bubble-content">
                        {message.content}
                      </div>
                      {message.actions && message.actions.length > 0 && (
                        <div className="sloane-options">
                          {message.actions.map(action => (
                            <button
                              key={action.href}
                              className="sloane-action-btn"
                              onClick={() => {
                                setViewState("closed");
                                router.push(action.href as Route);
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {sending && (
                    <div className="sloane-typing">
                      <span></span><span></span><span></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="sloane-input-bar" onSubmit={handleSubmit}>
                  <input
                    placeholder={mode === "lead" ? "Type your response..." : "Ask Sloane anything..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !input.trim()}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </form>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {viewState === "closed" && (
        <motion.button
          className="sloane-fab"
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
