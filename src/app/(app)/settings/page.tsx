import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@/utils/supabase/server";
import { THEME_COOKIE, isTheme, type Theme } from "@/lib/theme";
import {
  ACCENT_COOKIE,
  ACCENT_CUSTOM_BG_COOKIE,
  ACCENT_CUSTOM_FG_COOKIE,
  ACCENT_CUSTOM_DEFAULT_BG,
  ACCENT_CUSTOM_DEFAULT_FG,
  isAccent,
  isHexColor,
  type AccentId,
} from "@/lib/accent";
import { AppearanceForm } from "@/components/appearance-form";

export const metadata: Metadata = {
  title: "Settings - Template",
  description: "Appearance and account settings",
};

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const currentTheme: Theme = isTheme(themeCookie) ? themeCookie : "system";
  const accentCookie = cookieStore.get(ACCENT_COOKIE)?.value;
  const currentAccent: AccentId = isAccent(accentCookie) ? accentCookie : "default";
  const customBgCookie = cookieStore.get(ACCENT_CUSTOM_BG_COOKIE)?.value;
  const customFgCookie = cookieStore.get(ACCENT_CUSTOM_FG_COOKIE)?.value;
  const customBg = isHexColor(customBgCookie) ? customBgCookie : ACCENT_CUSTOM_DEFAULT_BG;
  const customFg = isHexColor(customFgCookie) ? customFgCookie : ACCENT_CUSTOM_DEFAULT_FG;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12 animate-page-in">
      <h1 className="text-xl font-semibold text-foreground">Settings</h1>

      <AppearanceForm
        initialTheme={currentTheme}
        initialAccent={currentAccent}
        initialCustomBg={customBg}
        initialCustomFg={customFg}
      />
    </div>
  );
}
