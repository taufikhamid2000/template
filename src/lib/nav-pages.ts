import { LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

// Single list of sidebar pages. Add a page here (plus its dictionary label
// under `nav`, its screen in app/(app)/layout.tsx and its TITLES entry in
// the shell) and it shows up in the sidebar, the New-style bottom bar and
// the bottom-bar settings picker.
export const NAV_PAGES: { id: "dashboard" | "settings"; href: string; icon: LucideIcon }[] = [
  { id: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "settings", href: "/settings", icon: Settings },
];
