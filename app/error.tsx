"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "16px",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
      <p style={{ color: "var(--text-soft)", maxWidth: "400px" }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="header-button"
        style={{ marginTop: "8px" }}
      >
        Try again
      </button>
    </main>
  );
}
