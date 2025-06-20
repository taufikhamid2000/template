import { createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

// Create a server client that properly handles cookies for SSR
export const createServerClient = cache(async () => {
  const cookieStore = await cookies();

  // Initialize the Supabase client with the server context
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          // This will only work in a Server Action or Route Handler
          try {
            cookieStore.set(name, value, options);
          } catch {
            // We can't set cookies in a Server Component directly
            // This will fail silently in middleware or when headers are already sent
          }
        },
        remove(name) {
          // This will only work in a Server Action or Route Handler
          try {
            cookieStore.delete(name);
          } catch {
            // We can't delete cookies in a Server Component directly
            // This will fail silently in middleware or when headers are already sent
          }
        },
      },
    }
  );
});
