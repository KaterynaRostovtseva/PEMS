/** Спільні картки і списки для трьох дашбордів. */
import type { ReactNode } from "react";
import { Link } from "react-router";
import { useLocale, type MessageKey } from "~/lib/i18n";
import { crmCardClass } from "~/components/ui/CrmTable";

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
    <div className="rounded-2xl border border-slate-200/80 border-t-4 border-t-[#3E64FF] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(28,73,192,0.65)] dark:border-slate-800 dark:border-t-[#3E64FF] dark:bg-slate-900">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-[#1C49C0] dark:text-[#9DB4FF]">
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
    <section className={crmCardClass}>
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
          <Link
            to={`/projects/${p.id}`}
            className="font-medium text-[#1C49C0] hover:underline dark:text-[#9DB4FF]"
          >
            {p.name || p.id}
          </Link>
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

export function StatGrid({
  columns = 4,
  children,
}: {
  columns?: 3 | 4;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}
    >
      {children}
    </div>
  );
}

export function QuickLinks({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}

export function DashboardColumns({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-2">{children}</div>;
}

export function QuickLink({
  to,
  children,
  primary = false,
}: {
  to: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        primary
          ? "inline-flex items-center rounded-xl bg-[#3E64FF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3457e6]"
          : "inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-[#3E64FF]/40 hover:text-[#1C49C0] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      }
    >
      {children}
    </Link>
  );
}
