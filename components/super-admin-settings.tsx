"use client";

import { useState } from "react";

export function SuperAdminSettings() {
  const [sensitivity, setSensitivity] = useState(84);
  const [authToggle, setAuthToggle] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>Global Platform Settings</h1>
        <p style={{ color: "#64748B", margin: 0, fontSize: "1rem", maxWidth: "800px", lineHeight: "1.5" }}>Configure system-wide parameters, AI thresholds, and security protocols for the entire RealtyOS ecosystem.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", background: "#F1F5F9", borderRadius: "12px", width: "fit-content", padding: "6px" }}>
         {["AI Parameters", "Billing Plans", "Security", "Notifications"].map((tab, idx) => (
           <button key={tab} style={{ 
             padding: "10px 24px", 
             borderRadius: "8px", 
             background: idx === 0 ? "#FFFFFF" : "transparent",
             color: idx === 0 ? "#ff7300" : "#64748B",
             border: "none",
             fontWeight: "700",
             fontSize: "0.9rem",
             boxShadow: idx === 0 ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
             cursor: "pointer"
           }}>
             {tab}
           </button>
         ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

         {/* Left Col */}
         <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* AI Config */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "32px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FFF6F0", display: "grid", placeItems: "center", color: "#ff7300" }}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>AI Logic Configuration</h2>
                 </div>
                 <span style={{ fontSize: "0.7rem", fontWeight: "800", padding: "4px 10px", background: "#FFF6F0", color: "#ff7300", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active</span>
               </div>

               <div style={{ marginBottom: "32px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
                   <div>
                     <strong style={{ display: "block", color: "#0F172A", fontSize: "0.95rem", marginBottom: "4px" }}>Qualification Sensitivity</strong>
                     <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Determines lead scoring strictness across all agencies</span>
                   </div>
                   <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ff7300" }}>{sensitivity}%</div>
                 </div>
                 <div style={{ position: "relative", height: "32px", display: "flex", alignItems: "center", marginBottom: "8px" }}>
                   <div style={{ position: "absolute", width: "100%", height: "4px", background: "#F1F5F9", borderRadius: "2px" }}></div>
                   <input 
                     type="range" min="0" max="100" value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))}
                     style={{ width: "100%", zIndex: 10, cursor: "pointer", opacity: 0 }} 
                   />
                   <div style={{ position: "absolute", width: `${sensitivity}%`, height: "4px", background: "#ff7300", borderRadius: "2px" }}></div>
                   <div style={{ position: "absolute", left: `calc(${sensitivity}% - 8px)`, width: "16px", height: "16px", background: "#ff7300", borderRadius: "50%", boxShadow: "0 0 0 4px #FFF6F0" }}></div>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: "800", color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                   <span>Loose</span>
                   <span>Aggressive</span>
                 </div>
               </div>

               <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
                 <div style={{ flex: 1 }}>
                   <strong style={{ display: "block", color: "#0F172A", fontSize: "0.95rem", marginBottom: "8px" }}>Inference Model</strong>
                   <select style={{ width: "100%", padding: "12px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#1E293B", fontWeight: "500", fontSize: "0.95rem", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231E293B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}>
                     <option>GPT-4o Realty (Optimized)</option>
                   </select>
                 </div>
                 <div style={{ flex: 1 }}>
                   <strong style={{ display: "block", color: "#0F172A", fontSize: "0.95rem", marginBottom: "8px" }}>Response Latency Target</strong>
                   <select style={{ width: "100%", padding: "12px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#1E293B", fontWeight: "500", fontSize: "0.95rem", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231E293B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}>
                     <option>Balanced (500ms)</option>
                   </select>
                 </div>
               </div>

               <div style={{ background: "#FFF6F0", border: "1px solid #FFEDD5", borderRadius: "8px", padding: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
                 <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#ff7300", color: "#FFF", display: "grid", placeItems: "center", fontWeight: "800", fontSize: "0.8rem", flexShrink: 0 }}>i</div>
                 <span style={{ fontSize: "0.9rem", color: "#C2410C", fontWeight: "500" }}>Changing these settings will propagate to all 124 connected agency nodes within 5 minutes.</span>
               </div>
            </div>

            {/* Subscriptions */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                 <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>Subscription Tiers</h2>
                 <button style={{ background: "none", border: "none", color: "#ff7300", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer" }}><span style={{ fontSize: "1.2rem", lineHeight: "1" }}>+</span> New Tier</button>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                   <div>
                     <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Standard</div>
                     <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A" }}>$499<span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: "600" }}>/mo</span></div>
                   </div>
                   <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#475569", flex: 1 }}>
                     <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "#ff7300" }}>✓</span> 5,000 leads</li>
                     <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "#ff7300" }}>✓</span> Basic AI Agents</li>
                   </ul>
                   <button style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#0F172A", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer" }}>Edit Plan</button>
                </div>

                <div style={{ flex: 1, background: "#ff7300", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", color: "#FFF", position: "relative", overflow: "hidden" }}>
                   <div>
                     <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Enterprise</div>
                     <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFFFFF" }}>$1,299<span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>/mo</span></div>
                   </div>
                   <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.9)", flex: 1 }}>
                     <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "#FFF" }}>✓</span> Unlimited leads</li>
                     <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "#FFF" }}>✓</span> Custom training</li>
                   </ul>
                   <button style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "none", borderRadius: "8px", color: "#ff7300", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", zIndex: 10 }}>Manage Plan</button>
                   
                   <div style={{ position: "absolute", top: "16px", right: "16px", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center" }}>
                     <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                   </div>
                </div>

                <div style={{ flex: 1, background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                   <div style={{ textAlign: "center" }}>
                     <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#64748B", marginBottom: "4px" }}>Custom Package</div>
                     <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bespoke Enterprise</div>
                   </div>
                   <button style={{ padding: "8px 16px", background: "#FFF6F0", border: "none", borderRadius: "8px", color: "#ff7300", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer" }}>Configure</button>
                </div>
              </div>
            </div>
         </div>

         {/* Right Col */}
         <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Security Widget */}
            <div style={{ background: "#0F172A", borderRadius: "16px", padding: "32px", color: "#FFFFFF" }}>
               <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "32px" }}>
                 <div style={{ color: "#ff7300" }}>
                   <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 11h6.5c-.32 2.76-2.16 5.11-4.7 6.43V11H6V6.3l6-2.67V11h6.5z"/></svg>
                 </div>
                 <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0 }}>Security Protocols</h2>
               </div>

               <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "4px" }}>Enforce 2FA</strong>
                     <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Mandatory for all Admin users</span>
                   </div>
                   <button onClick={() => setAuthToggle(!authToggle)} style={{ width: "44px", height: "24px", borderRadius: "12px", background: authToggle ? "#ff7300" : "#475569", border: "none", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                     <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#FFFFFF", position: "absolute", top: "2px", left: authToggle ? "22px" : "2px", transition: "left 0.2s" }}></div>
                   </button>
                 </div>

                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "4px" }}>AES-256 Encryption</strong>
                     <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Data-at-rest protection</span>
                   </div>
                   <div style={{ fontSize: "0.6rem", fontWeight: "800", padding: "4px 8px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enabled</div>
                 </div>

                 <div>
                   <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "12px" }}>Session Timeout</strong>
                   <div style={{ display: "flex", gap: "8px" }}>
                     <button style={{ flex: 1, padding: "8px", background: "transparent", border: "1px solid #334155", borderRadius: "6px", color: "#CBD5E1", fontSize: "0.85rem", cursor: "pointer" }}>15m</button>
                     <button style={{ flex: 1, padding: "8px", background: "#ff7300", border: "none", borderRadius: "6px", color: "#FFFFFF", fontSize: "0.85rem", cursor: "pointer", fontWeight: "600" }}>1h</button>
                     <button style={{ flex: 1, padding: "8px", background: "transparent", border: "1px solid #334155", borderRadius: "6px", color: "#CBD5E1", fontSize: "0.85rem", cursor: "pointer" }}>4h</button>
                   </div>
                 </div>
               </div>

               <button style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#E2E8F0", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "600", marginTop: "32px", cursor: "pointer" }}>
                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 View Security Audit Log
               </button>
            </div>

            {/* System Health Light */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
               <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0 0 20px 0" }}>System Health</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                 <div>
                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                     <span>Node Sync</span>
                     <span style={{ color: "#0F172A" }}>99.9%</span>
                   </div>
                   <div style={{ width: "100%", height: "4px", background: "#F1F5F9", borderRadius: "2px" }}>
                     <div style={{ width: "99.9%", height: "100%", background: "#ff7300", borderRadius: "2px" }}></div>
                   </div>
                 </div>
                 <div>
                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                     <span>API Latency</span>
                     <span style={{ color: "#0F172A" }}>42MS</span>
                   </div>
                   <div style={{ width: "100%", height: "4px", background: "#F1F5F9", borderRadius: "2px" }}>
                     <div style={{ width: "20%", height: "100%", background: "#0F172A", borderRadius: "2px" }}></div>
                   </div>
                 </div>
               </div>
            </div>

            <button style={{ width: "100%", padding: "16px", background: "#ff7300", border: "none", borderRadius: "12px", color: "#FFFFFF", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(242, 92, 5, 0.25)" }}>
               Deploy Global Changes
               <svg style={{ marginLeft: "4px" }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </button>
         </div>

      </div>

    </div>
  )
}
