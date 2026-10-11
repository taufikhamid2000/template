import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { UI_STYLE_COOKIE } from "@/lib/ui-style";

export async function middleware(req: NextRequest) {
  // ?ui=classic / ?ui=new switches the UI style from any URL — the escape
  // hatch back to the classic layout. Mirrored onto the request so the page
  // rendering this very request already sees it.
  const requested = req.nextUrl.searchParams.get("ui");
  const switchUi = requested === "classic" || requested === "new";
  if (switchUi) req.cookies.set(UI_STYLE_COOKIE, requested);
  const res = switchUi ? NextResponse.next({ request: { headers: req.headers } }) : NextResponse.next();
  if (switchUi) {
    res.cookies.set(UI_STYLE_COOKIE, requested, { sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ALWAYS call getUser() here – it pings the Auth API and refreshes tokens
  await supabase.auth.getUser(); // not getSession()

  return res;
}

// only run on routes that ever touch Supabase
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
