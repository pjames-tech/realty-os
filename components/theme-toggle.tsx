"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("realtyos-theme", theme);
}

export function ThemeToggle({
  className = ""
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem("realtyos-theme");
    const nextTheme = stored === "dark" ? "dark" : "light";
    setTheme(nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      type="button"
    >
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
