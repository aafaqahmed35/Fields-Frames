import { draftMode } from "next/headers";

export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) {
    return null;
  }

  return (
    <aside
      aria-label="Editorial preview controls"
      style={{
        alignItems: "center",
        background: "#171714",
        bottom: "1rem",
        color: "#fff",
        display: "flex",
        fontFamily: "var(--font-source-sans), sans-serif",
        fontSize: "0.75rem",
        gap: "0.75rem",
        left: "50%",
        letterSpacing: "0.04em",
        padding: "0.55rem 0.75rem",
        position: "fixed",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <span>Draft preview</span>
      <form action="/api/draft-mode/disable" method="post">
        <button
          style={{
            background: "transparent",
            border: "1px solid currentColor",
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
            padding: "0.25rem 0.45rem",
          }}
          type="submit"
        >
          Exit
        </button>
      </form>
    </aside>
  );
}
