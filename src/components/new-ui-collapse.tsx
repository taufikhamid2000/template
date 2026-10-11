// Used by the "New" interface style to fold secondary content (charts, long
// forms) behind a tap so the page leads with what matters. With the Classic
// style (`enabled` false) it renders its children untouched, so the same
// page code serves both. A plain <details>, so it needs no client JS.
export function NewUiCollapse({
  enabled,
  title,
  variant = "card",
  defaultOpen = false,
  children,
}: {
  enabled: boolean;
  title: string;
  // "card": boxed section with a chevron. "button": a pill button that
  // reveals the content (for add forms).
  variant?: "card" | "button";
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  if (!enabled) return <>{children}</>;

  if (variant === "button") {
    return (
      <details className="group/collapse" open={defaultOpen}>
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          + {title}
        </summary>
        <div className="mt-3">{children}</div>
      </details>
    );
  }

  return (
    <details className="group/collapse rounded-2xl border border-border bg-muted/40" open={defaultOpen}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-1.5 p-4">
        <span className="text-foreground/40 transition-transform group-open/collapse:rotate-90">▸</span>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </summary>
      <div className="flex flex-col gap-8 border-t border-border p-4">{children}</div>
    </details>
  );
}
