/** Світла і темна тема. Запам'ятовується в localStorage, ключ pems.theme. */
export type Theme = "light" | "dark";

export const THEME_KEY = "pems.theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

export function toggleTheme(current: Theme): Theme {
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
