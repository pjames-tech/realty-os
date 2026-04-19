"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Reuse AgentMessage type definition
type AgentMessage = {
  id: string;
  sender: "client" | "agent";
  content: string;
  timestamp: string;
};

// Sloane message type
type SloaneMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ClientMessages() {
  const [activeTab, setActiveTab] = useState<"agent" | "sloane">("agent");
  
  // Agent state
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentInput, setAgentInput] = useState("");
  const [sendingAgent, setSendingAgent] = useState(false);
  
  // Sloane state
  const [sloaneMessages, setSloaneMessages] = useState<SloaneMessage[]>([
    { role: "assistant", content: "Hi! I am Sloane. How can I help you today?" }
  ]);
  const [sloaneInput, setSloaneInput] = useState("");
  const [sendingSloane, setSendingSloane] = useState(false);

  const agentEndRef = useRef<HTMLDivElement>(null);
  const sloaneEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Load agent messages
  useEffect(() => {
    fetch("/api/client/messages")
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setAgentMessages(data.messages);
        }
      })
      .catch(console.error);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (activeTab === "agent" && agentEndRef.current) {
      agentEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (activeTab === "sloane" && sloaneEndRef.current) {
      sloaneEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [agentMessages, sloaneMessages, activeTab]);

  async function handleAgentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agentInput.trim() || sendingAgent) return;
    
    setSendingAgent(true);
    const content = agentInput.trim();
    setAgentInput("");

    // Optimistic UI
    const tempMsg: AgentMessage = {
      id: "temp-" + Date.now(),
      sender: "client",
      content,
      timestamp: new Date().toISOString()
    };
    setAgentMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/client/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.messages) setAgentMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingAgent(false);
    }
  }

  async function handleSloaneSubmit(e: FormEvent) {
    e.preventDefault();
    if (!sloaneInput.trim() || sendingSloane) return;

    setSendingSloane(true);
    const content = sloaneInput.trim();
    setSloaneInput("");

    const nextMessages = [...sloaneMessages, { role: "user" as const, content }];
    setSloaneMessages(nextMessages);

    try {
      const response = await fetch("/api/sloane/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPath: pathname,
          messages: nextMessages
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);

      setSloaneMessages(curr => [
        ...curr,
        { role: "assistant", content: payload.reply || "I'm here to help." }
      ]);
    } catch {
      setSloaneMessages(curr => [
        ...curr,
        { role: "assistant", content: "I'm having trouble connecting right now." }
      ]);
    } finally {
      setSendingSloane(false);
    }
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 200px)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface)" }}>
      {/* Sidebar */}
      <div style={{ width: "280px", borderRight: "1px solid var(--border)", background: "var(--surface-alt)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Messages</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          <button 
            onClick={() => setActiveTab("agent")}
            style={{
              width: "100%", padding: "16px", display: "flex", alignItems: "center", gap: "12px", border: "none", cursor: "pointer", borderBottom: "1px solid var(--border)",
              background: activeTab === "agent" ? "var(--surface)" : "transparent",
              borderLeft: activeTab === "agent" ? "4px solid var(--brand-blue)" : "4px solid transparent",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ccc", overflow: "hidden" }}>
               <Image src="/agent-avatar.png" alt="Agent" width={40} height={40} />
            </div>
            <div style={{ textAlign: "left" }}>
              <strong style={{ display: "block", color: "var(--text)" }}>Sarah Jenkins</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>Your Agent</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab("sloane")}
            style={{
              width: "100%", padding: "16px", display: "flex", alignItems: "center", gap: "12px", border: "none", cursor: "pointer", borderBottom: "1px solid var(--border)",
              background: activeTab === "sloane" ? "var(--surface)" : "transparent",
              borderLeft: activeTab === "sloane" ? "4px solid var(--brand-blue)" : "4px solid transparent",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--brand-blue)", display: "grid", placeItems: "center", color: "#fff" }}>
               <Image src="/sloane-avatar.png" alt="Sloane" width={40} height={40} />
            </div>
            <div style={{ textAlign: "left" }}>
              <strong style={{ display: "block", color: "var(--text)" }}>Sloane AI</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>Smart Assistant</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        {activeTab === "agent" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
              <strong>Sarah Jenkins</strong>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {agentMessages.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text-soft)", marginTop: "40px" }}>
                  Send a message to start the conversation.
                </div>
              ) : (
                agentMessages.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.sender === "client" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                     <div style={{ 
                       padding: "12px 16px", 
                       borderRadius: msg.sender === "client" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                       background: msg.sender === "client" ? "var(--brand-blue)" : "var(--surface-alt)",
                       color: msg.sender === "client" ? "#fff" : "var(--text)",
                       border: msg.sender === "agent" ? "1px solid var(--border)" : "none",
                       lineHeight: "1.5"
                     }}>
                       {msg.content}
                     </div>
                  </div>
                ))
              )}
              <div ref={agentEndRef} />
            </div>
            <form onSubmit={handleAgentSubmit} style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", gap: "12px" }}>
              <input 
                type="text" 
                value={agentInput} 
                onChange={(e) => setAgentInput(e.target.value)} 
                placeholder="Type your message..." 
                style={{ flex: 1, padding: "12px 16px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface-alt)" }}
                disabled={sendingAgent}
              />
              <button 
                type="submit" 
                disabled={sendingAgent || !agentInput.trim()} 
                style={{ background: "var(--brand-blue)", color: "#fff", border: "none", borderRadius: "100px", padding: "0 24px", fontWeight: "600", cursor: "pointer", opacity: (!agentInput.trim() || sendingAgent) ? 0.5 : 1 }}
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
              <strong>Sloane AI</strong>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
               {sloaneMessages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                     <div style={{ 
                       padding: "12px 16px", 
                       borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                       background: msg.role === "user" ? "var(--brand-blue)" : "var(--surface-alt)",
                       color: msg.role === "user" ? "#fff" : "var(--text)",
                       border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                       lineHeight: "1.5"
                     }}>
                       {msg.content}
                     </div>
                  </div>
                ))}
                {sendingSloane && (
                  <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: "var(--surface-alt)", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--text-soft)" }}>Typing...</span>
                  </div>
                )}
                <div ref={sloaneEndRef} />
            </div>
            <form onSubmit={handleSloaneSubmit} style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", gap: "12px" }}>
              <input 
                type="text" 
                value={sloaneInput} 
                onChange={(e) => setSloaneInput(e.target.value)} 
                placeholder="Ask Sloane anything..." 
                style={{ flex: 1, padding: "12px 16px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface-alt)" }}
                disabled={sendingSloane}
              />
              <button 
                type="submit" 
                disabled={sendingSloane || !sloaneInput.trim()} 
                style={{ background: "var(--brand-blue)", color: "#fff", border: "none", borderRadius: "100px", padding: "0 24px", fontWeight: "600", cursor: "pointer", opacity: (!sloaneInput.trim() || sendingSloane) ? 0.5 : 1 }}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
