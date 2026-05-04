"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { Notification } from "@/lib/use-notifications";
import { timeAgo } from "@/lib/admin-helpers";
import { Icon } from "./icons";

const TYPE_ICONS: Record<string, ReactNode> = {
  lead: <Icon.User size={16} />,
  qualified: <Icon.Check size={16} />,
  booked: <Icon.Calendar size={16} />,
  system: <Icon.Bell size={16} />,
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
              <span className="notif-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "#FFF7ED", color: "#ff7300", flexShrink: 0 }} aria-hidden="true">
                {TYPE_ICONS[n.type] || <Icon.Bell size={16} />}
              </span>
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
