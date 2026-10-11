import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";
import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/get-dictionary";
import { UI_STYLE_COOKIE, parseUiStyle } from "@/lib/ui-style";
import { BOTTOM_BAR_COOKIE, parseBottomBar } from "@/lib/bottom-bar-prefs";
import { PRIVACY_COOKIE } from "@/lib/privacy";

// One shell for the whole authenticated app: the session check and both
// screens are rendered here once, and <AppShell> swaps between them on the
// client (history.pushState, no request). The routes under (app)/ still
// exist so /dashboard and /settings work as real URLs — refresh, deep
// links and the back button — but their pages render nothing themselves.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  // Redirect to login if no user is found
  if (!data?.user || error) {
    redirect("/auth/signin");
  }

  const { t } = await getDictionary();
  const cookieStore = await cookies();

  return (
    <AppShell
      nav={t.nav}
      uiStyle={parseUiStyle(cookieStore.get(UI_STYLE_COOKIE)?.value)}
      privacyOn={cookieStore.get(PRIVACY_COOKIE)?.value === "1"}
      bottomPageIds={parseBottomBar(cookieStore.get(BOTTOM_BAR_COOKIE)?.value)}
      screens={{
        "/dashboard": <DashboardScreen user={data.user} />,
        "/settings": <SettingsScreen />,
      }}
    >
      {children}
    </AppShell>
  );
}
