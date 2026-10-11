"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { UI_STYLE_COOKIE, parseUiStyle } from "@/lib/ui-style";

export async function setUiStyle(formData: FormData) {
  const style = parseUiStyle(String(formData.get("ui_style") ?? ""));
  const cookieStore = await cookies();
  cookieStore.set(UI_STYLE_COOKIE, style, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  revalidatePath("/", "layout");
}
