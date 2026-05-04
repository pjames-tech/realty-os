"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Icon } from "./icons";
import { useToast } from "@/components/toast";

export function SuperAdminAgencyDetail() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "var(--font-sans)" }}>
      {/* Breadcrumbs */}
      <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem", fontWeight: "600", color: "#94A3B8", alignItems: "center" }}>
        <Link href={"/super-admin" as Route} style={{ color: "#ff7300", textDecoration: "none" }}>Dashboard</Link>
        <span>/</span>
        <Link href={"/super-admin/agencies" as Route} style={{ color: "#ff7300", textDecoration: "none" }}>Agencies</Link>
        <span>/</span>
        <span style={{ color: "#1E293B" }}>Infrastructure</span>
      </div>

      {/* Header Profile */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "16px", background: "#0F172A", display: "grid", placeItems: "center", color: "#FFF", padding: "12px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "100%", height: "100%", opacity: 0.8 }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>Vanguard Realty Group</h1>
              <span style={{ fontSize: "0.7rem", fontWeight: "800", padding: "4px 10px", background: "#FFF6F0", color: "#ff7300", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B", fontSize: "0.95rem" }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>Manhattan, New York • Premium Partner</span>
            </div>
            <div style={{ display: "flex", gap: "24px", marginTop: "4px", fontSize: "0.95rem", color: "#475569", fontWeight: "500" }}>
               <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "#ff7300", display: "inline-flex" }} aria-hidden="true"><Icon.Mail size={14} /></span> contact@vanguard.re</div>
               <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ color: "#ff7300", display: "inline-flex" }} aria-hidden="true"><Icon.Phone size={14} /></span> +1 (212) 555-0198</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => toast("Generating CSV export for Vanguard Realty Group…", "info")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#0F172A", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Data
          </button>
          <button onClick={() => toast("Agency suspension requires admin confirmation via email.", "error")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#EF4444", border: "none", padding: "10px 20px", borderRadius: "8px", color: "#FFFFFF", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            Suspend Agency
          </button>
        </div>
      </div>

      {/* Row 1 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
           <h3 style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.05em", marginBottom: "16px" }}>Avg Response Time</h3>
           <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
             <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>14</span>
             <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: "600" }}>min</span>
             <span style={{ fontSize: "0.85rem", color: "#16A34A", fontWeight: "700" }}>~12%</span>
           </div>
           <div style={{ width: "100%", height: "4px", background: "#F1F5F9", borderRadius: "4px", overflow: "hidden" }}>
             <div style={{ width: "80%", height: "100%", background: "#ff7300" }}></div>
           </div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
           <h3 style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.05em", marginBottom: "16px" }}>Lead Conversion</h3>
           <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
             <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>4.8</span>
             <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: "600" }}>%</span>
             <span style={{ fontSize: "0.85rem", color: "#16A34A", fontWeight: "700" }}>~0.4%</span>
           </div>
           <div style={{ width: "100%", height: "4px", background: "#F1F5F9", borderRadius: "4px", overflow: "hidden" }}>
             <div style={{ width: "45%", height: "100%", background: "#ff7300" }}></div>
           </div>
        </div>

        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "12px", padding: "24px", position: "relative", overflow: "hidden" }}>
           <h3 style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.05em", marginBottom: "16px" }}>Enterprise Plan</h3>
           <div style={{ color: "#94A3B8", fontSize: "0.85rem", marginBottom: "4px" }}>Next Renewal</div>
           <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "16px" }}>October 12, 2024</div>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <span style={{ color: "#ff7300", fontWeight: "700", fontSize: "0.9rem" }}>Elite Tier</span>
             <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94A3B8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <svg style={{ position: "absolute", top: "10px", right: "20px", width: "40px", height: "40px", opacity: 0.1, fill: "currentColor", color: "#FFFFFF" }} viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        </div>

        <div style={{ background: "#ff7300", borderRadius: "12px", padding: "24px", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
           <h3 style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.05em", marginBottom: "16px" }}>MTD Revenue</h3>
           <div style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1", marginBottom: "16px" }}>$42,850.00</div>
           <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>Billed via Stripe Auto-pay</div>
           {/* Abstract shape overlay */}
           <div style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "100px", height: "100px", background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
        </div>

      </div>

      {/* Row 2 Complex Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

         {/* Left Col */}
         <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>Top Performing Agents</h2>
              <button onClick={() => toast("Opening full agent roster…", "info")} style={{ background: "none", border: "none", color: "#ff7300", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer" }}>View All 142 Agents</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { name: "Marcus Sterling", role: "Luxury Residential Specialist", sales: "$12.4M", qual: "98%" },
                { name: "Elena Rodriguez", role: "Commercial Portfolio Mgr", sales: "$9.8M", qual: "94%" },
                { name: "Julian Vance", role: "New Development Expert", sales: "$7.2M", qual: "92%" }
              ].map(agent => (
                <div key={agent.name} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                   <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                     <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#CBD5E1", overflow: "hidden" }}>
                        <Image src="/agent-avatar.png" alt={agent.name} width={48} height={48} />
                     </div>
                     <div>
                       <strong style={{ display: "block", color: "#0F172A", fontSize: "1.05rem", fontWeight: "700" }}>{agent.name}</strong>
                       <span style={{ fontSize: "0.85rem", color: "#64748B" }}>{agent.role}</span>
                     </div>
                   </div>
                   <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
                     <div>
                       <div style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total Sales</div>
                       <strong style={{ fontSize: "1.05rem", color: "#0F172A" }}>{agent.sales}</strong>
                     </div>
                     <div>
                       <div style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Matches</div>
                       <div style={{ background: "#DCFCE7", color: "#16A34A", padding: "2px 8px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "700" }}>{agent.qual} Lead Quality</div>
                     </div>
                     <button onClick={() => toast(`Viewing performance for ${agent.name}`, "info")} style={{ width: "32px", height: "32px", border: "none", background: "#F1F5F9", borderRadius: "50%", color: "#64748B", display: "grid", placeItems: "center", cursor: "pointer", fontSize: "1.2rem", paddingBottom: "2px" }}>
                       &rsaquo;
                     </button>
                   </div>
                </div>
              ))}
            </div>
         </div>

         {/* Right Col */}
         <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: "0 0 20px 0" }}>Administrative Logs</h2>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", gap: "24px" }}>
                 <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                   <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F1F5F9", color: "#64748B", display: "grid", placeItems: "center" }}>
                     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <div>
                     <strong style={{ display: "block", color: "#0F172A", fontSize: "0.95rem" }}>Subscription Upgraded</strong>
                     <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>By Admin: Sarah J. • 2 days ago</span>
                   </div>
                 </div>
                 
                 <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                   <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FEF2F2", color: "#EF4444", display: "grid", placeItems: "center" }}>
                     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   </div>
                   <div>
                     <strong style={{ display: "block", color: "#0F172A", fontSize: "0.95rem" }}>Failed API Webhook</strong>
                     <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Service: CRM-Sync • 4 hours ago</span>
                   </div>
                 </div>

                 <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                   <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "grid", placeItems: "center" }}>
                     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <div>
                     <strong style={{ display: "block", color: "#0F172A", fontSize: "0.95rem" }}>Compliance Audit Passed</strong>
                     <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Quarterly Review • Sep 10, 2024</span>
                   </div>
                 </div>

                 <button onClick={() => toast("Accessing SOC-2 audit logs…", "info")} style={{ width: "100%", padding: "12px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#0F172A", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", marginTop: "8px", transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="#F1F5F9"} onMouseOut={e=>e.currentTarget.style.background="#F8FAFC"}>
                   View Security Audit Log
                 </button>
              </div>
            </div>

            <div style={{ background: "#ff7300", borderRadius: "12px", padding: "32px", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "1.4rem", fontWeight: "800" }}>Reach Global</h3>
              <p style={{ margin: "0 0 24px 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.5", position: "relative", zIndex: 10 }}>Expand Vanguard Realty to European markets with the new Multi-Currency module.</p>
              <button onClick={() => toast("Multi-Currency module enabled (Beta)", "success")} style={{ background: "#FFFFFF", color: "#ff7300", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", position: "relative", zIndex: 10, boxShadow: "0 4px 14px rgba(0,0,0,0.1)", transition: "transform 0.15s" }} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>Enable Beta Module</button>
              
              <div style={{ position: "absolute", right: "-30px", bottom: "-30px", width: "160px", height: "160px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", zIndex: 1 }}></div>
            </div>
         </div>

      </div>

    </div>
  )
}
