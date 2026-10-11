import { cookies } from "next/headers";
import { THEME_COOKIE, isTheme, type Theme } from "@/lib/theme";
import {
  ACCENT_COOKIE,
  ACCENT_CUSTOM_BG_COOKIE,
  ACCENT_CUSTOM_FG_COOKIE,
  ACCENT_CUSTOM_DEFAULT_BG,
  ACCENT_CUSTOM_DEFAULT_FG,
  isAccent,
  isHexColor,
  type AccentId,
} from "@/lib/accent";
import { LOCALES } from "@/lib/i18n";
import { setUiStyle } from "@/app/actions/ui-style";
import { setBottomBar } from "@/app/actions/bottom-bar";
import { UI_STYLE_COOKIE, parseUiStyle } from "@/lib/ui-style";
import { BOTTOM_BAR_COOKIE, BOTTOM_BAR_MAX, parseBottomBar } from "@/lib/bottom-bar-prefs";
import { NAV_PAGES } from "@/lib/nav-pages";
import { setLocale } from "@/app/actions/locale";
import { AppearanceForm } from "@/components/appearance-form";
import { SubmitButton } from "@/components/submit-button";
import { getDictionary } from "@/lib/get-dictionary";

// Server-rendered by the (app) layout and handed to <AppShell> as a prop,
// so the shell can swap between screens on the client with no request.
export async function SettingsScreen() {
  const { t: dict, locale: currentLocale } = await getDictionary();

  const LANGUAGE_LABEL: Record<string, string> = {
    en: dict.settings.languageEnglish,
    ms: dict.settings.languageMalay,
  };

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const currentTheme: Theme = isTheme(themeCookie) ? themeCookie : "system";
  const accentCookie = cookieStore.get(ACCENT_COOKIE)?.value;
  const currentAccent: AccentId = isAccent(accentCookie) ? accentCookie : "default";
  const customBgCookie = cookieStore.get(ACCENT_CUSTOM_BG_COOKIE)?.value;
  const customFgCookie = cookieStore.get(ACCENT_CUSTOM_FG_COOKIE)?.value;
  const customBg = isHexColor(customBgCookie) ? customBgCookie : ACCENT_CUSTOM_DEFAULT_BG;
  const customFg = isHexColor(customFgCookie) ? customFgCookie : ACCENT_CUSTOM_DEFAULT_FG;

  const uiStyle = parseUiStyle(cookieStore.get(UI_STYLE_COOKIE)?.value);
  const bottomIds = parseBottomBar(cookieStore.get(BOTTOM_BAR_COOKIE)?.value);
  const pillOn =
    "cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  const pillOff =
    "cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12 animate-page-in">
      <h1 className="text-xl font-semibold text-foreground">{dict.settings.title}</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground/60">{dict.settings.language}</h2>
        <div className="flex gap-2">
          {LOCALES.map((locale) => (
            <form key={locale} action={setLocale}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="redirect_to" value="/settings" />
              <SubmitButton
                ariaPressed={currentLocale === locale}
                className={
                  currentLocale === locale
                    ? "cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    : "cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                }
              >
                {LANGUAGE_LABEL[locale]}
              </SubmitButton>
            </form>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground/60">{dict.settings.interfaceStyle}</h2>
        <div className="flex gap-2">
          {(["classic", "new"] as const).map((style) => (
            <form key={style} action={setUiStyle}>
              <input type="hidden" name="ui_style" value={style} />
              <SubmitButton ariaPressed={uiStyle === style} className={uiStyle === style ? pillOn : pillOff}>
                {style === "classic" ? dict.settings.interfaceClassic : dict.settings.interfaceNew}
              </SubmitButton>
            </form>
          ))}
        </div>
        <p className="text-xs text-foreground/50">{dict.settings.interfaceHint}</p>
      </section>

      {uiStyle === "new" && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground/60">{dict.settings.bottomBar}</h2>
          <form action={setBottomBar} className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              {NAV_PAGES.map((page) => (
                <label key={page.id} className="flex min-h-11 items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="bottom_pages"
                    value={page.id}
                    defaultChecked={bottomIds.includes(page.id)}
                    className="h-4 w-4"
                  />
                  {dict.nav[page.id]}
                </label>
              ))}
            </div>
            <p className="text-xs text-foreground/50">{dict.settings.bottomBarHint.replace("3", String(BOTTOM_BAR_MAX))}</p>
            <div>
              <SubmitButton pendingText={dict.settings.saving} className={pillOn}>
                {dict.settings.save}
              </SubmitButton>
            </div>
          </form>
        </section>
      )}

      <AppearanceForm
        initialTheme={currentTheme}
        initialAccent={currentAccent}
        initialCustomBg={customBg}
        initialCustomFg={customFg}
        dict={dict.settings}
      />
    </div>
  );
}
