/** Спільні стилі і розбір помилки API для сторінок проєкту. */
import type { ProjectRoleName, ProjectStatus, StageStatus } from "~/store/apiSlice";
import { apiErrorMessage } from "~/lib/apiError";
import { useFieldError } from "~/lib/fieldError";
import { crmCardClass, crmSurfaceClass } from "~/components/ui/CrmTable";

export const projectFieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#3E64FF] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

export const projectButtonClass =
  "rounded-xl bg-[#3E64FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3457e6] disabled:opacity-50";

export const projectSurfaceClass = crmSurfaceClass;

export const projectCardClass = crmCardClass;

export const PROJECT_STATUSES: ProjectStatus[] = ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"];
export const STAGE_STATUSES: StageStatus[] = ["TODO", "ACTIVE", "COMPLETED"];
export const PROJECT_ROLES: ProjectRoleName[] = [
  "PROJECT_MANAGER",
  "TEAM_LEAD",
  "DEVELOPER",
  "DESIGNER",
  "QA",
  "DEVOPS",
  "ANALYST",
  "BUSINESS_ANALYST",
];

export function projectApiError(error: unknown, fallback: string): string {
  return apiErrorMessage(error, fallback);
}

export function ProjectTextField({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const { ref, error, onBlur } = useFieldError<HTMLInputElement>(value, { required, type: "text" });

  return (
    <label className={`block text-sm text-slate-600 dark:text-slate-300 ${className}`}>
      {label}
      <input
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        className={`${projectFieldClass} ${label ? "mt-1.5" : ""} ${error ? "!border-red-400 focus:!border-red-400" : ""}`}
      />
      {error && <span className="mt-1.5 block text-sm text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
