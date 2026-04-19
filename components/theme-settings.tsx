"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type ThemeMode = "light" | "dark";

const SETTINGS_KEY = "realtyos-admin-settings";
const AVATAR_STORAGE_KEY = "realtyos-admin-avatar";
const USER_NAME_KEY = "realtyos-admin-name";
const USER_ROLE_KEY = "realtyos-admin-role";

interface AdminSettings {
  assistantName: string;
  toneStyle: string;
  followUpDelay: string;
  autoBooking: boolean;
  theme: ThemeMode;
}

const DEFAULT_SETTINGS: AdminSettings = {
  assistantName: "Dane",
  toneStyle: "professional",
  followUpDelay: "5min",
  autoBooking: true,
  theme: "light"
};

function loadSettings(): AdminSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: AdminSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("realtyos-theme", theme);
}

export function ThemeSettings() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading settings...</div>}>
      <ThemeSettingsInner />
    </Suspense>
  );
}

function ThemeSettingsInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "profile" ? "Profile" : "AI Responses";
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [activeNav, setActiveNav] = useState(initialTab);
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profileName, setProfileName] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyTheme(loaded.theme);

    // Load profile info
    const storedName = localStorage.getItem(USER_NAME_KEY);
    if (storedName) setProfileName(storedName);
    const storedRole = localStorage.getItem(USER_ROLE_KEY);
    if (storedRole) setProfileRole(storedRole);
    const storedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (storedAvatar) setAvatarSrc(storedAvatar);
  }, []);

  function update(partial: Partial<AdminSettings>) {
    setSettings((prev) => ({ ...prev, ...partial }));
    setSaved(false);
  }

  function handleThemeToggle() {
    const next = settings.theme === "dark" ? "light" : "dark";
    update({ theme: next });
    applyTheme(next);
  }

  function handleSave() {
    saveSettings(settings);
    // Also persist user name if changed
    localStorage.setItem("realtyos-admin-name", settings.assistantName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleProfileSave() {
    if (profileName.trim()) {
      localStorage.setItem(USER_NAME_KEY, profileName.trim());
    }
    if (profileRole.trim()) {
      localStorage.setItem(USER_ROLE_KEY, profileRole.trim());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAvatarUpload() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarSrc(dataUrl);
      localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handlePasswordChange() {
    setPasswordMsg("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("Please fill in all password fields.");
      return;
    }
    if (currentPassword !== "realty123") {
      setPasswordMsg("Current password is incorrect.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    // In a real app, this would call an API. For now, show success.
    setPasswordMsg("✓ Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordMsg(""), 3000);
  }

  const profileInitials = profileName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  const navItems = ["Profile", "General Config", "Lead Routing", "AI Responses", "Integrations", "Billing & Plans"];

  return (
    <div className="crm-settings-grid">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarChange}
      />

      <header className="crm-settings-topbar">
        <div className="crm-settings-actions" style={{ marginLeft: "auto" }}>
          <button className="crm-btn-primary" onClick={activeNav === "Profile" ? handleProfileSave : handleSave}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      <section className="crm-settings-layout">
        <aside className="crm-settings-menu">
          <nav>
            {navItems.map((item) => (
              <button
                key={item}
                className={`crm-settings-nav-item ${activeNav === item ? "active" : ""}`}
                onClick={() => setActiveNav(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <div className="crm-settings-content">
          {activeNav === "Profile" && (
            <>
              <div className="crm-settings-section-head">
                <h3>Profile Settings</h3>
                <p>Update your personal information, avatar, and password.</p>
              </div>

              <div className="crm-settings-form">
                {/* Avatar */}
                <div className="crm-form-group" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div
                    className="crm-profile-avatar-large"
                    onClick={handleAvatarUpload}
                    title="Click to change avatar"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      profileInitials
                    )}
                  </div>
                  <div>
                    <button className="crm-btn-outline" onClick={handleAvatarUpload}>
                      Upload New Photo
                    </button>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px" }}>
                      JPG, PNG, or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <hr className="crm-settings-divider" />

                {/* Name & Role */}
                <div className="crm-form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Your name"
                  />
                  <span className="form-hint">This name will appear in the sidebar and topbar.</span>
                </div>

                <div className="crm-form-group">
                  <label>Role / Title</label>
                  <input
                    type="text"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    placeholder="e.g. Lead Specialist"
                  />
                </div>

                <hr className="crm-settings-divider" />

                {/* Password Change */}
                <div className="crm-settings-section-head" style={{ marginTop: "8px" }}>
                  <h3>Change Password</h3>
                  <p>Update your admin account password.</p>
                </div>

                <div className="crm-form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="crm-form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="crm-form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>

                {passwordMsg && (
                  <p style={{
                    color: passwordMsg.startsWith("✓") ? "var(--success, #22c55e)" : "var(--error, #ef4444)",
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}>
                    {passwordMsg}
                  </p>
                )}

                <button className="crm-btn-outline" onClick={handlePasswordChange} style={{ marginTop: "8px" }}>
                  Update Password
                </button>
              </div>
            </>
          )}

          {activeNav === "AI Responses" && (
            <>
              <div className="crm-settings-section-head">
                <h3>Virtual Assistant Settings</h3>
                <p>Customize how the AI interacts with your leads on the public facing widgets.</p>
              </div>

              <div className="crm-settings-form">
                <div className="crm-form-group">
                  <label>Assistant Name</label>
                  <input
                    type="text"
                    value={settings.assistantName}
                    onChange={(e) => update({ assistantName: e.target.value })}
                  />
                  <span className="form-hint">The name your leads will see when chatting.</span>
                </div>

                <div className="crm-form-group">
                  <label>Tone &amp; Style</label>
                  <select value={settings.toneStyle} onChange={(e) => update({ toneStyle: e.target.value })}>
                    <option value="professional">Professional &amp; Direct</option>
                    <option value="warm">Warm &amp; Friendly</option>
                    <option value="luxury">Luxury &amp; Exclusive</option>
                  </select>
                </div>

                <div className="crm-form-group">
                  <label>Automated Follow-up Delay</label>
                  <select value={settings.followUpDelay} onChange={(e) => update({ followUpDelay: e.target.value })}>
                    <option value="instant">Instant</option>
                    <option value="5min">5 Minutes</option>
                    <option value="15min">15 Minutes</option>
                    <option value="1hour">1 Hour</option>
                  </select>
                </div>

                <hr className="crm-settings-divider" />

                <div className="crm-toggle-row">
                  <div className="crm-toggle-info">
                    <strong>Enable Auto-Booking</strong>
                    <p>Allow the AI to schedule appointments directly to your calendar when a lead is qualified.</p>
                  </div>
                  <button className={`crm-switch ${settings.autoBooking ? "on" : "off"}`} onClick={() => update({ autoBooking: !settings.autoBooking })}>
                    <span className="switch-thumb"></span>
                  </button>
                </div>

                <div className="crm-toggle-row">
                  <div className="crm-toggle-info">
                    <strong>Dark Mode (Admin)</strong>
                    <p>Toggle the appearance of the admin dashboard between light and dark themes.</p>
                  </div>
                  <button className={`crm-switch ${settings.theme === "dark" ? "on" : "off"}`} onClick={handleThemeToggle}>
                    <span className="switch-thumb"></span>
                  </button>
                </div>

                <hr className="crm-settings-divider" />

                <div className="crm-kb-sync-section">
                  <div className="crm-kb-info">
                    <strong>Knowledge Base Sync</strong>
                    <p>Last synced: 2 hours ago from your active listing data.</p>
                  </div>
                  <button className="crm-btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l-5.6 5.6"></path></svg>
                    Sync MLS Data
                  </button>
                </div>
              </div>
            </>
          )}

          {activeNav === "General Config" && (
            <>
              <div className="crm-settings-section-head">
                <h3>General Configuration</h3>
                <p>Basic settings for your CRM instance.</p>
              </div>
              <div className="crm-settings-form">
                <div className="crm-form-group">
                  <label>Company Name</label>
                  <input type="text" defaultValue="RealtyOS" />
                </div>
                <div className="crm-form-group">
                  <label>Admin Email</label>
                  <input type="email" defaultValue="admin@realtyos.com" />
                </div>
                <div className="crm-form-group">
                  <label>Timezone</label>
                  <select defaultValue="america_chicago">
                    <option value="america_new_york">Eastern (EST)</option>
                    <option value="america_chicago">Central (CST)</option>
                    <option value="america_denver">Mountain (MST)</option>
                    <option value="america_los_angeles">Pacific (PST)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeNav === "Lead Routing" && (
            <>
              <div className="crm-settings-section-head">
                <h3>Lead Routing Rules</h3>
                <p>Configure how leads are assigned and routed in your team.</p>
              </div>
              <div className="crm-settings-form">
                <div className="crm-form-group">
                  <label>Default Assignment</label>
                  <select defaultValue="round_robin">
                    <option value="round_robin">Round Robin</option>
                    <option value="least_loaded">Least Loaded Agent</option>
                    <option value="manual">Manual Assignment</option>
                  </select>
                </div>
                <div className="crm-toggle-row">
                  <div className="crm-toggle-info">
                    <strong>Auto-assign Zillow leads</strong>
                    <p>Automatically assign Zillow leads to the designated Zillow specialist.</p>
                  </div>
                  <button className="crm-switch on"><span className="switch-thumb"></span></button>
                </div>
              </div>
            </>
          )}

          {activeNav === "Integrations" && (
            <>
              <div className="crm-settings-section-head">
                <h3>Integrations</h3>
                <p>Connect third-party services to enhance your CRM workflow.</p>
              </div>
              <div className="crm-settings-form">
                <div className="crm-kb-sync-section">
                  <div className="crm-kb-info">
                    <strong>Google Calendar</strong>
                    <p>Sync booked appointments to your Google Calendar.</p>
                  </div>
                  <button className="crm-btn-outline">Connect</button>
                </div>
                <div className="crm-kb-sync-section">
                  <div className="crm-kb-info">
                    <strong>Supabase Database</strong>
                    <p>Connect a Supabase instance for persistent lead storage.</p>
                  </div>
                  <button className="crm-btn-outline">Coming Soon</button>
                </div>
              </div>
            </>
          )}

          {activeNav === "Billing & Plans" && (
            <>
              <div className="crm-settings-section-head">
                <h3>Billing &amp; Plans</h3>
                <p>Manage your subscription and billing information.</p>
              </div>
              <div className="crm-settings-form">
                <div className="crm-kb-sync-section">
                  <div className="crm-kb-info">
                    <strong>Current Plan: Free</strong>
                    <p>You are on the free tier. Upgrade to Pro for advanced AI features.</p>
                  </div>
                  <button className="crm-btn-primary">Upgrade to Pro</button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
