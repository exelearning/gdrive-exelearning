import en from './locales/en';

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;

/** Same twelve interface languages as the eXeLearning editor. */
export const SUPPORTED_LOCALES = [
  'ca',
  'de',
  'en',
  'eo',
  'es',
  'eu',
  'fr',
  'gl',
  'it',
  'pt',
  'ro',
  'va',
] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  ca: 'Català',
  de: 'Deutsch',
  en: 'English',
  eo: 'Esperanto',
  es: 'Español',
  eu: 'Euskara',
  fr: 'Français',
  gl: 'Galego',
  it: 'Italiano',
  pt: 'Português',
  ro: 'Română',
  va: 'Valencià',
};

export const LOCALE_STORAGE_KEY = 'gdrive-exelearning.locale';

export interface LocaleSources {
  /** `?hl=` query parameter, Google's own convention. */
  query?: string | null;
  /** Choice remembered from the language selector. */
  saved?: string | null;
  /** `navigator.languages`, most preferred first. */
  browser?: readonly string[];
}

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Same precedence as the eXeLearning static editor (explicit choice, then
 * browser language, then English), with `?hl=` on top so a link can pin it.
 * Region subtags are dropped: `es-ES` resolves to `es`.
 */
export function resolveLocale(sources: LocaleSources): Locale {
  const candidates = [sources.query, sources.saved, ...(sources.browser ?? [])];
  for (const candidate of candidates) {
    const base = candidate?.trim().toLowerCase().split(/[-_]/)[0];
    if (base && isLocale(base)) {
      return base;
    }
  }
  return 'en';
}

// One chunk per locale; only the active one is downloaded.
const loaders = import.meta.glob<{ default: Messages }>('./locales/*.ts');

export async function loadMessages(locale: Locale): Promise<Messages> {
  if (locale === 'en') {
    return en;
  }
  const load = loaders[`./locales/${locale}.ts`];
  if (!load) {
    throw new Error(`No dictionary for locale ${locale}.`);
  }
  return (await load()).default;
}

let activeLocale: Locale = 'en';
let activeMessages: Messages = en;

export function currentLocale(): Locale {
  return activeLocale;
}

export async function setLocale(locale: Locale): Promise<void> {
  activeMessages = await loadMessages(locale);
  activeLocale = locale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

export function readSavedLocale(): string | null {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function rememberLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
}

/** Resolve the locale for this page load and activate its dictionary. */
export async function initI18n(): Promise<Locale> {
  const locale = resolveLocale({
    query: new URLSearchParams(window.location.search).get('hl'),
    saved: readSavedLocale(),
    browser: navigator.languages ?? [navigator.language],
  });
  await setLocale(locale);
  return locale;
}

export function t(
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = activeMessages[key] ?? en[key];
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
