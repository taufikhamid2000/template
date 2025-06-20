"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import SignOutButton from "@/components/auth/sign-out-button";
import { Menu, X } from "lucide-react";
import UserNavDropdown from "@/components/layout/user-nav-dropdown";

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/"
          className="hover:text-blue-600 mr-4 dark:hover:text-blue-400"
        >
          Home
        </Link>

        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : user ? (
          // Authenticated menu items
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Dashboard
            </Link>
            {user && <UserNavDropdown user={user} />}
          </div>
        ) : (
          // Unauthenticated menu items
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Burger Menu */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
          >
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {loading ? (
              <span className="block px-4 py-2 text-sm text-gray-400">
                Loading...
              </span>
            ) : user ? (
              // Authenticated mobile menu
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user && (
                  <div className="px-4 py-2 text-sm text-blue-800 dark:text-blue-300 bg-gray-50 dark:bg-gray-700">
                    {user.email?.split("@")[0]}
                  </div>
                )}
                <div className="px-3 py-1">
                  <SignOutButton
                    variant="link"
                    className="w-full text-left text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  />
                </div>
              </>
            ) : (
              // Unauthenticated mobile menu
              <>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
