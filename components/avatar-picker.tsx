"use client";

import { useState, useEffect } from "react";

const AVATAR_COLORS = [
  "#2563EB", "#0F172A", "#6366F1", "#0EA5E9",
  "#8B5CF6", "#475569", "#059669", "#DC2626",
  "#D97706", "#7C3AED", "#0891B2", "#4F46E5"
];

export function AvatarPicker() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const storedColor = localStorage.getItem("realtyos-avatar-color");
    if (storedColor) setColor(storedColor);

    // Try to get initials from the client name
    fetch("/api/client/me", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (data.lead?.name) {
          const parts = data.lead.name.split(" ");
          const ini = parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
          setInitials(ini);
        }
      })
      .catch(() => {});
  }, []);

  function handleSelect(c: string) {
    setColor(c);
    localStorage.setItem("realtyos-avatar-color", c);
    setOpen(false);

    try {
      fetch("/api/client/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: c }),
      });
    } catch {
      // silently fail
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        style={{
          background: color,
          border: "none",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          fontSize: "0.85rem",
          fontWeight: "700",
          color: "#FFFFFF",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          letterSpacing: "0.03em",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
        onClick={() => setOpen(!open)}
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "8px",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            padding: "16px",
            width: "200px",
            zIndex: 100
          }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Choose Color</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {AVATAR_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSelect(c)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: c,
                    border: color === c ? "3px solid #0F172A" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "transform 0.15s",
                    outline: color === c ? "2px solid #FFFFFF" : "none"
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
