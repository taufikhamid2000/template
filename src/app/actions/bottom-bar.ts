"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { BOTTOM_BAR_COOKIE, defaultBottomBar, parseBottomBar } from "@/lib/bottom-bar-prefs";

export async function setBottomBar(formData: FormData) {
  const picked = parseBottomBar(formData.getAll("bottom_pages").map(String).join(","));
  const cookieStore = await cookies();
  if (picked.join(",") === defaultBottomBar().join(",")) {
    cookieStore.delete(BOTTOM_BAR_COOKIE);
  } else {
    cookieStore.set(BOTTOM_BAR_COOKIE, picked.join(","), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  revalidatePath("/", "layout");
}
