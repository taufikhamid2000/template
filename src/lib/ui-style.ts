// Which shell the signed-in app renders in. "classic" is the original
// sidebar/drawer layout and stays the default; "new" adds the phone bottom
// bar and lets pages fold secondary content (see NewUiCollapse). Stored in
// a cookie like the other display prefs, and also settable with
// ?ui=classic|new on any URL (see middleware.ts) so there's always a way
// back if "new" misbehaves.
export const UI_STYLE_COOKIE = "ui_style";

export type UiStyle = "classic" | "new";

export function parseUiStyle(value: string | undefined | null): UiStyle {
  return value === "new" ? "new" : "classic";
}
