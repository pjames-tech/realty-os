"use client";

import { useRef, useEffect } from "react";
import { Notification } from "@/lib/use-notifications";
import { timeAgo } from "@/lib/admin-helpers";

const TYPE_ICONS: Record<string, string> = {
  lead: "👤",
  qualified: "✅",
  booked: "📅",
  system: "🔔"
};

export function NotificationPanel({
  notifications,
  onMarkAllRead,
  onClearAll,
  onClose
}: {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div className="notif-panel" ref={panelRef}>
      <div className="notif-header">
        <h3>Notifications</h3>
        <div className="notif-header-actions">
          <button onClick={onMarkAllRead} className="notif-action-link">Mark all read</button>
          <button onClick={onClearAll} className="notif-action-link">Clear all</button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <p className="notif-empty">No notifications yet.</p>
        ) : (
          notifications.slice(0, 20).map((n) => (
            <div 
              key={n.id} 
              className={`notif-item ${n.read ? "" : "unread"}`}
              onClick={onClose}
              style={{ cursor: "pointer", transition: "background 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#F1F5F9")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span className="notif-icon">{TYPE_ICONS[n.type] || "🔔"}</span>
              <div className="notif-content">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span className="notif-time">{timeAgo(n.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
