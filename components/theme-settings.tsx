"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("realtyos-theme", theme);
}

export function ThemeSettings() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem("realtyos-theme");
    const nextTheme = stored === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  function handleThemeChange(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <section className="settings-grid">
      <article className="settings-card">
        <div className="section-head">
          <div>
            <span className="section-kicker">Appearance</span>
            <h2>Theme mode</h2>
          </div>
          <p>Switch between light and dark mode for the admin dashboard.</p>
        </div>

        <div className="theme-choice-row">
          <button
            className={`theme-choice ${theme === "light" ? "theme-choice-active" : ""}`}
            onClick={() => handleThemeChange("light")}
            type="button"
          >
            <strong>Light mode</strong>
            <span>Bright surfaces, soft borders, neutral workspace.</span>
          </button>
          <button
            className={`theme-choice ${theme === "dark" ? "theme-choice-active" : ""}`}
            onClick={() => handleThemeChange("dark")}
            type="button"
          >
            <strong>Dark mode</strong>
            <span>Low-glare surfaces with the same orange accent system.</span>
          </button>
        </div>
      </article>

      <article className="settings-card">
        <div className="section-head">
          <div>
            <span className="section-kicker">Behavior</span>
            <h2>Current theme</h2>
          </div>
          <p>The selected theme is stored locally and persists across admin pages.</p>
        </div>

        <div className="settings-summary">
          <span className="status-pill status-qualified">{theme}</span>
        </div>
      </article>
    </section>
  );
}
