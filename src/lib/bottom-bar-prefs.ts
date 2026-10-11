import { NAV_PAGES } from "@/lib/nav-pages";

export const BOTTOM_BAR_COOKIE = "bottom_bar_pages";
export const BOTTOM_BAR_MAX = 3;

const VALID = new Set<string>(NAV_PAGES.map((p) => p.id));

// Which pages get a slot in the New-style bottom bar; everything else sits
// behind "More". No cookie = the first BOTTOM_BAR_MAX pages in NAV_PAGES.
export function defaultBottomBar(): string[] {
  return NAV_PAGES.slice(0, BOTTOM_BAR_MAX).map((p) => p.id);
}

export function parseBottomBar(value: string | undefined): string[] {
  if (value === undefined) return defaultBottomBar();
  const ids = Array.from(new Set(value.split(",").filter((id) => VALID.has(id)))).slice(0, BOTTOM_BAR_MAX);
  return ids.length ? ids : defaultBottomBar();
}
