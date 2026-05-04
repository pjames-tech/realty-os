"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/toast";
import type { Route } from "next";

const AGENCIES = [
  { id: "vanguard", name: "Vanguard Estates", location: "Global HQ • London, UK", plan: "ENTERPRISE", agents: 428, leads: "12,450", growth: "+12%", status: "Active" },
  { id: "skyline", name: "Skyline Properties", location: "Franchise • New York, US", plan: "PROFESSIONAL", agents: 86, leads: "3,200", growth: "-4%", status: "Pending" },
  { id: "luxe", name: "Luxe Haven", location: "Boutique • Dubai, UAE", plan: "ENTERPRISE", agents: 154, leads: "5,890", growth: "+8%", status: "Active" },
  { id: "pacific", name: "Pacific Realty", location: "Regional • Sydney, AU", plan: "STARTER", agents: 12, leads: "450", growth: "-15%", status: "Suspended" }
];

export function SuperAdminAgenciesList() {
  const { toast } = useToast();
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "var(--font-sans)" }}>
       {/* Header */}
       <div>
         <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>Agency Directory</h1>
         <p style={{ color: "#64748B", margin: 0, fontSize: "1rem", maxWidth: "800px", lineHeight: "1.5" }}>Manage global real estate franchises, monitor lead performance, and oversee platform-wide subscription health.</p>
       </div>

       {/* Top Cards */}
       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", display: "flex", gap: "20px", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#FFF6F0", display: "grid", placeItems: "center", color: "#ff7300" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <h3 style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>Total Agencies</h3>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>1,284</div>
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", display: "flex", gap: "20px", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#EFF6FF", display: "grid", placeItems: "center", color: "#3B82F6" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>Pending Approvals</h3>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>18</div>
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", display: "flex", gap: "20px", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#FEF2F2", display: "grid", placeItems: "center", color: "#EF4444" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 style={{ fontSize: "0.75rem", color: "#EF4444", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>High-Churn Risk</h3>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>42</div>
            </div>
          </div>
       </div>

       {/* Toolbar */}
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ display: "flex", gap: "12px" }}>
             <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} style={{ padding: "10px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#1E293B", fontWeight: "500", fontSize: "0.9rem", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: "40px" }}>
               <option>All Plans</option>
               <option>Enterprise</option>
               <option>Professional</option>
             </select>
             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "10px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#1E293B", fontWeight: "500", fontSize: "0.9rem", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: "40px" }}>
               <option>All Status</option>
               <option>Active</option>
               <option>Pending</option>
             </select>
             <button onClick={() => toast("Sorted by date joined", "info")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#1E293B", fontWeight: "500", fontSize: "0.9rem", cursor: "pointer" }}>
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               Date Joined
             </button>
           </div>
          <button onClick={() => toast("Agency registration form opened", "info")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ff7300", border: "none", padding: "10px 20px", borderRadius: "8px", color: "#FFFFFF", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(242, 92, 5, 0.25)" }}>
             <span style={{ fontSize: "1.2rem", lineHeight: "1" }}>+</span> Register New Agency
          </button>
       </div>

       {/* Table */}
       <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "20px 24px", fontSize: "0.75rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Agency Name</th>
                <th style={{ padding: "20px 24px", fontSize: "0.75rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Plan</th>
                <th style={{ padding: "20px 24px", fontSize: "0.75rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Agents</th>
                <th style={{ padding: "20px 24px", fontSize: "0.75rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Lead Volume (Mo)</th>
                <th style={{ padding: "20px 24px", fontSize: "0.75rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "20px 24px", fontSize: "0.75rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {AGENCIES.map((agency) => {
                const isGrowthPos = agency.growth.startsWith("+");
                const isVanguard = agency.name === "Vanguard Estates";
                return (
                  <tr key={agency.id} style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.2s", cursor: isVanguard ? "pointer" : "default", background: "transparent" }}>
                    <td style={{ padding: "20px 24px" }}>
                      <Link href={isVanguard ? "/super-admin/agencies/vanguard" as Route : "#" as Route} style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none", color: "inherit", pointerEvents: isVanguard ? "auto" : "none" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#F1F5F9", display: "grid", placeItems: "center", color: "#94A3B8" }}>
                           {agency.name.charAt(0)}
                        </div>
                        <div>
                          <strong style={{ display: "block", color: "#0F172A", fontSize: "1rem", fontWeight: "700", marginBottom: "4px" }}>{agency.name}</strong>
                          <span style={{ fontSize: "0.85rem", color: "#64748B" }}>{agency.location}</span>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <span style={{ 
                        padding: "4px 12px", 
                        borderRadius: "100px", 
                        fontSize: "0.7rem", 
                        fontWeight: "800", 
                        letterSpacing: "0.05em",
                        background: agency.plan === "ENTERPRISE" ? "#FFF6F0" : "#F1F5F9",
                        color: agency.plan === "ENTERPRISE" ? "#ff7300" : "#64748B"
                      }}>
                        {agency.plan}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", color: "#0F172A", fontWeight: "500", fontSize: "0.95rem" }}>
                      {agency.agents}
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <strong style={{ color: "#0F172A", fontSize: "0.95rem" }}>{agency.leads}</strong>
                      <span style={{ marginLeft: "8px", fontSize: "0.75rem", fontWeight: "700", color: isGrowthPos ? "#16A34A" : "#EF4444" }}>{agency.growth}</span>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: "600", color: agency.status === "Active" ? "#16A34A" : agency.status === "Pending" ? "#EAB308" : "#EF4444" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "currentColor" }}></span>
                        {agency.status}
                      </div>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                       {/* Dropdown ellipsis placeholder */}
                       <button onClick={() => toast(`Actions for ${agency.name}`, "info")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                         <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                       </button>
                    </td>
                  </tr>
                )}
              )}
            </tbody>
          </table>
          
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0" }}>
             <span style={{ fontSize: "0.85rem", color: "#64748B" }}>Showing <strong>1</strong> to <strong>10</strong> of <strong>1,284</strong> results</span>
             <div style={{ display: "flex", gap: "4px" }}>
               <button style={{ width: "32px", height: "32px", border: "1px solid #E2E8F0", background: "#FFFFFF", borderRadius: "6px", display: "grid", placeItems: "center", color: "#94A3B8", cursor: "not-allowed" }}>&lsaquo;</button>
               <button style={{ width: "32px", height: "32px", border: "none", background: "#ff7300", borderRadius: "6px", display: "grid", placeItems: "center", color: "#FFFFFF", fontWeight: "600", cursor: "default" }}>1</button>
               <button style={{ width: "32px", height: "32px", border: "none", background: "transparent", borderRadius: "6px", display: "grid", placeItems: "center", color: "#475569", fontWeight: "500", cursor: "pointer" }}>2</button>
               <button style={{ width: "32px", height: "32px", border: "none", background: "transparent", borderRadius: "6px", display: "grid", placeItems: "center", color: "#475569", fontWeight: "500", cursor: "pointer" }}>3</button>
               <span style={{ width: "32px", height: "32px", display: "grid", placeItems: "center", color: "#475569", fontWeight: "500" }}>...</span>
               <button style={{ width: "32px", height: "32px", border: "none", background: "transparent", borderRadius: "6px", display: "grid", placeItems: "center", color: "#475569", fontWeight: "500", cursor: "pointer" }}>128</button>
               <button style={{ width: "32px", height: "32px", border: "1px solid #E2E8F0", background: "#FFFFFF", borderRadius: "6px", display: "grid", placeItems: "center", color: "#0F172A", cursor: "pointer" }}>&rsaquo;</button>
             </div>
          </div>
       </div>

    </div>
  )
}
