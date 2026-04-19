"use client";

import { useCallback, useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "lead" | "qualified" | "booked" | "system";
}

const STORAGE_KEY = "realtyos-notifications";

function loadNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(list: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load on mount
  useEffect(() => {
    setNotifications(loadNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "timestamp" | "read">) => {
      const next: Notification = {
        ...n,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications((prev) => {
        const updated = [next, ...prev].slice(0, 50); // Keep last 50
        saveNotifications(updated);
        return updated;
      });
    },
    []
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  // Sync notifications from lead data — call this after fetching leads
  const syncFromLeads = useCallback(
    (leads: Array<{ id: string; name?: string; email?: string; status: string; createdAt: string }>) => {
      const existing = loadNotifications();
      const existingIds = new Set(existing.map((n) => n.id));
      const newNotifs: Notification[] = [];

      for (const lead of leads) {
        const label = lead.name || lead.email || "Unknown lead";

        // Generate a deterministic ID so we don't re-add the same event
        const leadCreatedId = `lead-new-${lead.id}`;
        if (!existingIds.has(leadCreatedId)) {
          newNotifs.push({
            id: leadCreatedId,
            title: "New Lead Captured",
            message: `${label} was ingested into the pipeline.`,
            timestamp: lead.createdAt,
            read: false,
            type: "lead"
          });
        }

        if (lead.status === "qualified" || lead.status === "booked") {
          const qualId = `lead-qual-${lead.id}`;
          if (!existingIds.has(qualId)) {
            newNotifs.push({
              id: qualId,
              title: lead.status === "booked" ? "Appointment Booked" : "Lead Qualified",
              message: `${label} has been ${lead.status}.`,
              timestamp: lead.createdAt,
              read: false,
              type: lead.status === "booked" ? "booked" : "qualified"
            });
          }
        }
      }

      if (newNotifs.length > 0) {
        const combined = [...newNotifs, ...existing]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 50);
        saveNotifications(combined);
        setNotifications(combined);
      }
    },
    []
  );

  return { notifications, unreadCount, addNotification, markAllRead, clearAll, syncFromLeads };
}
