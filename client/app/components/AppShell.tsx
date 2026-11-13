/** Рамка кабінету: шапка, меню зліва, заголовок сторінки, мова і тема. */
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "~/components/Sidebar";
import ThemeToggle from "~/components/ThemeToggle";
import UserMenu from "~/components/UserMenu";
import { useLocale, type MessageKey } from "~/lib/i18n";

const PAGE_TITLE_KEYS: Record<string, MessageKey> = {
  "/dashboard": "nav.dashboard",
  "/admin/team": "nav.team",
  "/profile": "menu.profile",
};

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m16.5 16.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 3.5 1.2 5 2 6H4c.8-1 2-2.5 2-6ZM10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeaderSearch() {
  const { t } = useLocale();
  return (
    <label className="relative hidden min-w-0 max-w-md flex-1 sm:block">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
        <IconSearch />
      </span>
      <input
        type="search"
        placeholder={t("shell.search")}
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#1C49C0]/40 focus:ring-2 focus:ring-[#1C49C0]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const selectLang = (next: "uk" | "en") => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        aria-label={t("shell.language")}
        title={t("shell.language")}
        aria-expanded={open}
      >
        <IconGlobe />
        <span className="text-xs font-semibold uppercase">{locale}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => selectLang("uk")}
            className={`flex w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${locale === "uk" ? "font-semibold text-[#1C49C0]" : "text-slate-700 dark:text-slate-200"}`}
          >
            {t("shell.uk")}
          </button>
          <button
            type="button"
            onClick={() => selectLang("en")}
            className={`flex w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${locale === "en" ? "font-semibold text-[#1C49C0]" : "text-slate-700 dark:text-slate-200"}`}
          >
            {t("shell.en")}
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationsBell() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        aria-label={t("shell.notifications")}
        title={t("shell.notifications")}
        aria-expanded={open}
      >
        <IconBell />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#1C49C0] ring-2 ring-[#F5F7FB] dark:ring-slate-950" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
            {t("shell.notifications")}
          </div>
          <div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t("shell.noNotifications")}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  const { pathname } = useLocation();
  const { t } = useLocale();
  const titleKey = PAGE_TITLE_KEYS[pathname];
  const title = titleKey ? t(titleKey) : "PEMS";

  return (
    <div className="flex min-h-screen bg-[#F3F6FB] text-slate-900 dark:bg-[#070b14] dark:text-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white px-6 lg:px-10 dark:border-white/10 dark:bg-[#0c1428]">
          <h1 className="shrink-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <HeaderSearch />
          <div className="ml-auto flex items-center gap-1 pl-8 sm:pl-12">
            <ThemeToggle />
            <LanguageToggle />
            <NotificationsBell />
            <div className="ml-3">
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
