import { Metadata } from "next";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Template",
  description: "Your dashboard",
};

export default async function DashboardPage() {
  const supabase = await createServerClient(); // Get session if available
  const { data, error } = await supabase.auth.getUser();

  // Redirect to login if no user is found
  if (!data?.user || error) {
    redirect("/auth/signin");
  }

  // Get user profile if user exists
  let userProfile = null;
  let userMetadata = null;

  if (data?.user) {
    // Get user metadata directly from user
    userMetadata = data.user.user_metadata;

    // Try to get profile from the profiles table
    const profileResponse = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single(); // Use profile data if available, otherwise fall back to user metadata
    if (profileResponse.data) {
      userProfile = profileResponse.data;
    } else {
      // Create a profile-like object from user metadata
      userProfile = {
        id: data.user.id,
        first_name: userMetadata?.first_name || "User",
        last_name: userMetadata?.last_name || "",
        role: userMetadata?.role || "user",
        email: data.user.email,
      };
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Welcome, {userProfile?.first_name || "Guest"}!
      </h1>{" "}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2">
            {userProfile ? (
              <>
                <p>
                  <strong>Name:</strong> {userProfile.first_name}{" "}
                  {userProfile.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {data?.user?.email || "Not available"}
                </p>
                <p>
                  <strong>Role:</strong> {userProfile.role || "User"}
                </p>
              </>
            ) : (
              <p>Sign in to view your profile information</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <p>
              This is your personal dashboard. You can customize it with the
              components you need.
            </p>
          </div>
        </div>{" "}
        {/* Debug information panel - only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Session Debug</h2>
            <div className="space-y-2 text-xs font-mono overflow-auto max-h-60 bg-gray-100 dark:bg-gray-900 p-3 rounded">
              <div>
                <strong>Session exists:</strong> {data?.user ? "Yes" : "No"}
              </div>
              {data?.user && (
                <>
                  <div>
                    <strong>User ID:</strong> {data.user.id}
                  </div>
                  <div>
                    <strong>Email:</strong> {data.user.email}
                  </div>
                  <div>
                    <strong>User metadata:</strong>{" "}
                    <pre>
                      {JSON.stringify(data.user.user_metadata, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
