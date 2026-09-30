import type { User } from "@supabase/supabase-js";
import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/get-dictionary";

// Server-rendered by the (app) layout and handed to <AppShell> as a prop,
// so the shell can swap between screens on the client with no request.
export async function DashboardScreen({ user }: { user: User }) {
  const supabase = await createServerClient();
  const { t: dict } = await getDictionary();

  // Get user metadata directly from user
  const userMetadata = user.user_metadata;

  // Try to get profile from the profiles table
  const profileResponse = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single(); // Use profile data if available, otherwise fall back to user metadata

  // Use profile data if available, otherwise create a profile-like object from user metadata
  const userProfile = profileResponse.data ?? {
    id: user.id,
    first_name: userMetadata?.first_name || dict.dashboard.guest,
    last_name: userMetadata?.last_name || "",
    role: userMetadata?.role || "user",
    email: user.email,
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-12 animate-page-in">
      <h1 className="text-xl font-semibold text-foreground">
        {dict.dashboard.welcome(userProfile?.first_name || dict.dashboard.guest)}
      </h1>{" "}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-muted/40 p-6">
          <h2 className="text-sm font-medium text-foreground/60 mb-4">{dict.dashboard.yourProfile}</h2>
          <div className="space-y-2">
            {userProfile ? (
              <>
                <p>
                  <strong>{dict.dashboard.name}</strong> {userProfile.first_name}{" "}
                  {userProfile.last_name}
                </p>
                <p>
                  <strong>{dict.dashboard.email}</strong> {user.email}
                </p>
                <p>
                  <strong>{dict.dashboard.role}</strong> {userProfile.role}
                </p>
              </>
            ) : (
              <p>{dict.dashboard.signInToView}</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-muted/40 p-6">
          <h2 className="text-sm font-medium text-foreground/60 mb-4">{dict.dashboard.quickActions}</h2>
          <div className="space-y-2">
            <p>{dict.dashboard.quickActionsBody}</p>
          </div>
        </div>{" "}
        {/* Debug information panel - only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <h2 className="text-sm font-medium text-foreground/60 mb-4">{dict.dashboard.sessionDebug}</h2>
            <div className="space-y-2 text-xs font-mono overflow-auto max-h-60 bg-muted p-3 rounded-lg border border-border">
              <div>
                <strong>{dict.dashboard.sessionExists}</strong> {dict.dashboard.yes}
              </div>
              <div>
                <strong>{dict.dashboard.userId}</strong> {user.id}
              </div>
              <div>
                <strong>{dict.dashboard.email}</strong> {user.email}
              </div>
              <div>
                <strong>{dict.dashboard.userMetadata}</strong>{" "}
                <pre>
                  {JSON.stringify(user.user_metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
