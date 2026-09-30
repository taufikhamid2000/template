import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";
import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/get-dictionary";

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

  return (
    <AppShell
      nav={t.nav}
      screens={{
        "/dashboard": <DashboardScreen user={data.user} />,
        "/settings": <SettingsScreen />,
      }}
    >
      {children}
    </AppShell>
  );
}
