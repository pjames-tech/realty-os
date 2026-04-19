import Link from "next/link";

export default function NotFound() {
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
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>404</h1>
      <p style={{ color: "var(--text-soft)", maxWidth: "400px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="header-button" style={{ marginTop: "8px" }}>
        Back to home
      </Link>
    </main>
  );
}
