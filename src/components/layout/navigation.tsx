"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Session } from "@supabase/supabase-js";

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const supabase = createClient();

    // Check current auth status
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      setLoading(false);
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);

        // If user just signed in, redirect to dashboard
        if (event === "SIGNED_IN" && sessionUser) {
          console.log(
            "Auth state change: signed in, redirecting to dashboard..."
          );
          window.location.href = "/dashboard";
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    // Use direct navigation to ensure a full page refresh
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center">
      <ul className="flex gap-4">
        {" "}
        <li>
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        {loading ? (
          // Show loading state
          <li className="text-gray-400">Loading...</li>
        ) : user ? (
          // Authenticated menu items
          <>
            <li>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="hover:text-blue-600"
              >
                Sign Out
              </Button>
            </li>
            <li className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {user.email?.split("@")[0]}
            </li>
          </>
        ) : (
          // Unauthenticated menu items
          <>
            <li>
              <Link href="/auth/signin" className="hover:text-blue-600">
                Sign In
              </Link>
            </li>
            <li>
              <Link
                href="/auth/signup"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
