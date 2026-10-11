"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Ellipsis, type LucideIcon } from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";
import { LogoMark } from "@/components/logo-mark";
import { PrivacyToggle } from "@/components/privacy-toggle";
import { NAV_PAGES } from "@/lib/nav-pages";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { UiStyle } from "@/lib/ui-style";

type NavDict = Dictionary["nav"];

// Full-width top bar (brand far left, sign-out far right) sits above
// everything else; the nav links live in a sidebar below it — a static
// column from md up, a slide-in drawer (opened from the header's
// hamburger) below that. Only wraps the authenticated (app) route group —
// the public home page and auth pages render their own minimal chrome
// instead, same split DuitDuit uses between its AppShell and /login.
//
// It's also the single shell for those screens: the layout renders every
// screen on the server once and passes them in via `screens`, keyed by
// path. Nav clicks call history.pushState (which Next syncs into
// usePathname) instead of navigating, so switching screens never hits the
// server. The routes still exist as real URLs for refresh/deep links/back.
// Keep TITLES in sync with each page's `metadata.title` — pushState doesn't
// re-run metadata, so the shell sets document.title itself.
const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard - Template",
  "/settings": "Settings - Template",
};

export function AppShell({
  nav,
  screens,
  uiStyle = "classic",
  privacyOn = false,
  bottomPageIds,
  children,
}: {
  nav: NavDict;
  uiStyle?: UiStyle;
  privacyOn?: boolean;
  bottomPageIds?: string[];
  screens: Record<string, React.ReactNode>;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const bottomBar = uiStyle === "new";

  const navLinks = NAV_PAGES.map((page) => ({
    id: page.id,
    href: page.href,
    label: nav[page.id],
    icon: page.icon,
  }));

  useEffect(() => {
    const title = TITLES[pathname];
    if (title) document.title = title;
  }, [pathname]);

  // Left-click without modifiers swaps screens in place; anything else
  // (ctrl/cmd-click, middle-click, ...) falls through to the normal link.
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (href !== pathname) window.history.pushState(null, "", href);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    const mql = window.matchMedia("(min-width: 768px)");
    function onMqlChange() {
      if (mql.matches) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    mql.addEventListener("change", onMqlChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      mql.removeEventListener("change", onMqlChange);
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? nav.closeMenu : nav.openMenu}
            onClick={() => setOpen((o) => !o)}
            className={`h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-[var(--nav-fg-muted)] transition-colors hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${bottomBar ? "hidden" : "flex md:hidden"}`}
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <Link
            href="/dashboard"
            onClick={(e) => handleNavClick(e, "/dashboard")}
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--nav-fg)]"
          >
            <LogoMark size={20} />
            {nav.brand}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <PrivacyToggle initial={privacyOn} hideLabel={nav.hideNumbers} showLabel={nav.showNumbers} />
          <SignOutButton
            variant="ghost"
            className="cursor-pointer text-sm text-[var(--nav-fg-muted)] underline-offset-4 transition-colors hover:text-destructive hover:underline"
            label={nav.signOut}
            pendingLabel={nav.signingOut}
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Mobile drawer */}
        <div
          aria-hidden={!open}
          className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-200 md:hidden ${
            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={nav.brand}
          className={`fixed top-14 bottom-0 left-0 z-30 flex w-64 flex-col overflow-y-auto border-r border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 py-4 shadow-xl transition-transform duration-200 md:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-1 flex-col gap-1">
            <NavLinks
              links={navLinks}
              pathname={pathname}
              onClick={handleNavClick}
              onNavigate={() => setOpen(false)}
            />
          </nav>
        </aside>

        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 flex-col overflow-y-auto border-r border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 py-6 md:flex">
          <nav className="flex flex-1 flex-col gap-1">
            <NavLinks links={navLinks} pathname={pathname} onClick={handleNavClick} />
          </nav>
        </aside>

        <main id="main-content" className={`flex flex-1 flex-col ${bottomBar ? "pb-20 md:pb-0" : ""}`}>
          {screens[pathname] ?? children}
        </main>
      </div>

      {bottomBar && (
        <BottomBar
          nav={nav}
          pathname={pathname}
          links={navLinks}
          bottomPageIds={bottomPageIds ?? []}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          onClick={handleNavClick}
        />
      )}
    </div>
  );
}

function NavLinks({
  links,
  pathname,
  onClick,
  onNavigate,
}: {
  links: NavItem[];
  pathname: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => {
              onClick(e, link.href);
              onNavigate?.();
            }}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex min-h-11 items-center gap-2.5 rounded-lg bg-[var(--nav-active-bg)] px-3 text-sm font-medium text-[var(--nav-fg)]"
                : "flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm text-[var(--nav-fg-muted)] transition-colors hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-fg)]"
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

type NavItem = { id: string; href: string; label: string; icon: LucideIcon };

// Phone-only bottom bar for the "new" UI style: the pages picked in
// Settings (up to three) plus "More" for the rest. The More button only
// appears when some page isn't in the bar.
function BottomBar({
  nav,
  pathname,
  links,
  bottomPageIds,
  moreOpen,
  setMoreOpen,
  onClick,
}: {
  nav: NavDict;
  pathname: string;
  links: NavItem[];
  bottomPageIds: string[];
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const primary = bottomPageIds
    .map((id) => links.find((l) => l.id === id))
    .filter((l): l is NavItem => !!l);
  const primaryIds = new Set(primary.map((p) => p.id));
  const moreLinks = links.filter((l) => !primaryIds.has(l.id));
  const moreActive = moreLinks.some((l) => l.href === pathname);

  useEffect(() => {
    if (!moreOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [moreOpen, setMoreOpen]);

  return (
    <>
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMoreOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={nav.more}
            className="fixed inset-x-0 bottom-16 z-40 max-h-[65vh] overflow-y-auto rounded-t-2xl border-t border-[var(--nav-border)] bg-[var(--nav-bg)] p-3 shadow-xl md:hidden"
          >
            <nav className="grid grid-cols-3 gap-2">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      onClick(e, link.href);
                      setMoreOpen(false);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-center text-xs ${
                      active
                        ? "bg-[var(--nav-active-bg)] font-medium text-[var(--nav-fg)]"
                        : "text-[var(--nav-fg-muted)] hover:bg-[var(--nav-hover-bg)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      <nav
        aria-label={nav.brand}
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur md:hidden"
      >
        {primary.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                onClick(e, item.href);
                setMoreOpen(false);
              }}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${
                active ? "font-medium text-primary" : "text-[var(--nav-fg-muted)]"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
        {moreLinks.length > 0 && (
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px] ${
              moreOpen || moreActive ? "font-medium text-primary" : "text-[var(--nav-fg-muted)]"
            }`}
          >
            <Ellipsis className="h-5 w-5" aria-hidden="true" />
            {nav.more}
          </button>
        )}
      </nav>
    </>
  );
}
