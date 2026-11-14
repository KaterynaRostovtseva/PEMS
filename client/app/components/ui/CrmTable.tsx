/** Заголовок сторінки і таблиця кабінету. Ними користуються список проєктів і команда. */
import type { ReactNode } from "react";

export const pageTitleClass = "text-2xl font-bold text-slate-900 dark:text-slate-100";

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={pageTitleClass}>{children}</h1>;
}

export const crmSurfaceClass =
  "rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(28,73,192,0.55)] dark:border-slate-800 dark:bg-slate-900";

export const crmCardClass = `${crmSurfaceClass} p-6`;

export const crmCell = "px-4 py-3";
export const crmCellMuted = `${crmCell} text-slate-600 dark:text-slate-400`;
export const crmCellStrong = `${crmCell} font-medium text-slate-800 dark:text-slate-100`;

export function CrmTable({
  columns,
  empty,
  children,
}: {
  columns: ReactNode[];
  empty?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={`overflow-x-auto ${crmSurfaceClass}`}>
      {empty ?? (
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4F7FF] text-[#1C49C0] dark:bg-slate-950 dark:text-[#9DB4FF]">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={`${crmCell} font-medium`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      )}
    </div>
  );
}

export function CrmRow({ children }: { children: ReactNode }) {
  return <tr className="border-t border-slate-100 dark:border-slate-800">{children}</tr>;
}
