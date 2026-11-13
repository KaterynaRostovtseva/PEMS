/** Спільні картки і списки для трьох дашбордів. */
import type { ReactNode } from "react";
import { Link } from "react-router";
import { useLocale, type MessageKey } from "~/lib/i18n";

export type ProjectItem = {
  id: string;
  name?: string;
  status?: string;
};

export type TimeEntryItem = {
  id: string;
  hours?: number;
  status?: string;
  date?: string;
  project?: { id: string; name: string };
};

export function unwrapList<T>(data: T[] | { data: T[] } | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.data ?? [];
}

export function DashboardHero({
  name,
  role,
  subtitle,
}: {
  name: string;
  role?: string;
  subtitle: string;
}) {
  const { t } = useLocale();
  const roleKey =
    role === "OWNER" || role === "MANAGER" || role === "EMPLOYEE"
      ? (`role.${role}` as MessageKey)
      : null;

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {t("dash.welcome", { name })}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        {roleKey ? t(roleKey) : role} · {subtitle}
      </p>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</div>
      )}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ProjectList({
  projects,
  isLoading,
  emptyText,
}: {
  projects: ProjectItem[];
  isLoading: boolean;
  emptyText?: string;
}) {
  const { t } = useLocale();
  if (isLoading) {
    return <p className="text-slate-500 dark:text-slate-400">{t("list.loadingProjects")}</p>;
  }

  if (projects.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">{emptyText ?? t("list.noProjects")}</p>;
  }

  return (
    <ul className="space-y-2">
      {projects.map((p) => (
        <li
          key={p.id}
          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {p.name || p.id}
          </span>
          {p.status && (
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {p.status}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function TimeEntryList({
  entries,
  isLoading,
}: {
  entries: TimeEntryItem[];
  isLoading: boolean;
}) {
  const { t, locale } = useLocale();
  if (isLoading) {
    return <p className="text-slate-500 dark:text-slate-400">{t("list.loadingTime")}</p>;
  }

  if (entries.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">{t("list.noTime")}</p>;
  }

  return (
    <ul className="space-y-2">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60"
        >
          <div className="min-w-0">
            <div className="truncate font-medium text-slate-800 dark:text-slate-100">
              {e.project?.name || t("list.project")}
            </div>
            <div className="text-xs text-slate-400">
              {e.date
                ? new Date(e.date).toLocaleDateString(locale === "en" ? "en-GB" : "uk-UA")
                : "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {e.hours != null ? t("list.hours", { hours: e.hours }) : "—"}
            </div>
            {e.status && (
              <div className="text-xs uppercase tracking-wide text-slate-400">
                {e.status}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function QuickLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-[#1C49C0]/30 hover:text-[#1C49C0] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {children}
    </Link>
  );
}
