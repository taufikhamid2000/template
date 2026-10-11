"use client";

import { useEffect, useState } from "react";
import { PRIVACY_COOKIE } from "@/lib/privacy";

// Matches "RM1,234.56", "-RM 12", or a bare 1,234.56 (tables without the
// RM prefix). Dates (01/10/2026) and percentages don't match.
const MONEY_RE = /RM\s?-?\d|\d{1,3}(?:,\d{3})*\.\d{2}\b|-?\d+\.\d{2}\b/;

// Tags the element holding each amount with data-money; CSS blurs those
// only while html[data-privacy="on"]. A data attribute (not a class) so
// React re-rendering className never wipes it, and text nodes stay put so
// React's own updates keep working.
function markMoney(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || el.hasAttribute("data-money")) continue;
    if (el.closest("script,style,noscript")) continue;
    if (MONEY_RE.test(n.nodeValue ?? "")) el.setAttribute("data-money", "");
  }
}

export function PrivacyToggle({
  initial,
  hideLabel,
  showLabel,
}: {
  initial: boolean;
  hideLabel: string;
  showLabel: string;
}) {
  const [hidden, setHidden] = useState(initial);

  useEffect(() => {
    document.documentElement.dataset.privacy = hidden ? "on" : "off";
    document.cookie = `${PRIVACY_COOKIE}=${hidden ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
    if (!hidden) return;
    markMoney(document.body);
    // Pages stream in and client components re-render, so keep tagging
    // new text while privacy is on.
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        markMoney(document.body);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [hidden]);

  const label = hidden ? showLabel : hideLabel;
  return (
    <button
      type="button"
      onClick={() => setHidden((h) => !h)}
      aria-label={label}
      aria-pressed={hidden}
      title={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[var(--nav-fg-muted)] transition-colors hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-fg)]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        {hidden && <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}
