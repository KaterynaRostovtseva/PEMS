/** Ліве меню. Працюють Дашборд і Команда. Проєкти та Завдання лише намальовані. */
import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { useLocale, type MessageKey } from "~/lib/i18n";

const SIDEBAR_KEY = "pems.sidebar.collapsed";

type NavItem = {
  to: string;
  label: MessageKey;
  icon: ReactNode;
  end?: boolean;
  roles?: Array<"OWNER" | "MANAGER" | "EMPLOYEE">;
};

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAccounts() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0" aria-hidden>
      <path
        d="M16 11a3 3 0 1 0-2.8-4M8 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3.5 19.5c.8-2.4 2.8-3.5 4.5-3.5s3.7 1.1 4.5 3.5M13.5 16c1.1-.4 2.5-.3 3.5.3 1.4.8 2.3 2.2 2.5 3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProjects() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0" aria-hidden>
      <path
        d="M4 7.5A1.5 1.5 0 0 1 5.5 6H9l1.5 2H18.5A1.5 1.5 0 0 1 20 9.5v7A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTasks() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0" aria-hidden>
      <path
        d="M9 6h11M9 12h11M9 18h11M4.5 6.5l1 1 2-2M4.5 12.5l1 1 2-2M4.5 18.5l1 1 2-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBilling() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0" aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 9.5h17M8 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`size-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
      aria-hidden
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPanel({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d={collapsed ? "M9 4v16M13 9l3 3-3 3" : "M9 4v16M14 9l-3 3 3 3"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "nav.dashboard", icon: <IconHome />, end: true },
  {
    to: "/admin/team",
    label: "nav.team",
    icon: <IconAccounts />,
    roles: ["OWNER", "MANAGER"],
  },
  { to: "/projects", label: "nav.projects", icon: <IconProjects /> },
];

const PLACEHOLDER_ITEMS = [{ label: "nav.tasks" as const, icon: <IconTasks /> }] as const;

export default function Sidebar() {
  const { user } = useAppSelector(selectAuth);
  const { t } = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "mx-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      collapsed ? "justify-center px-2" : "",
      isActive
        ? "bg-[#3E64FF] text-white shadow-[0_10px_24px_-12px_rgba(62,100,255,0.95)]"
        : "text-white/75 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const itemRowClass = collapsed
    ? "mx-3 flex items-center justify-center rounded-xl px-2 py-2.5 text-sm font-medium text-white/40"
    : "mx-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40";

  return (
    <aside
      className={[
        "sticky top-0 flex h-screen shrink-0 flex-col bg-[#07122B] text-white transition-[width] duration-300 ease-out",
        collapsed ? "w-[88px]" : "w-[240px]",
      ].join(" ")}
    >
      <div className="flex items-center justify-center px-4 pt-5 pb-8">
        <NavLink
          to="/dashboard"
          className="flex items-center justify-center"
          title="PEMS"
          aria-label="PEMS"
        >
          <img
            src="/icons/Logo.svg"
            alt="PEMS"
            className={`w-auto transition-[height] duration-300 ${collapsed ? "h-5" : "h-6"}`}
          />
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pt-2 pb-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            title={collapsed ? t(item.label) : undefined}
          >
            {item.icon}
            {!collapsed && <span>{t(item.label)}</span>}
          </NavLink>
        ))}

        {PLACEHOLDER_ITEMS.map((item) => (
          <div
            key={item.label}
            className={itemRowClass}
            title={collapsed ? `${t(item.label)} (${t("nav.soon")})` : undefined}
          >
            {item.icon}
            {!collapsed && <span>{t(item.label)}</span>}
          </div>
        ))}

        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setCollapsed(false);
                setBillingOpen(true);
                return;
              }
              setBillingOpen((v) => !v);
            }}
            className={[
              "mx-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white",
              collapsed ? "justify-center px-2" : "",
              billingOpen && !collapsed ? "bg-white/10 text-white" : "",
            ].join(" ")}
            title={collapsed ? t("nav.billing") : undefined}
          >
            <IconBilling />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{t("nav.billing")}</span>
                <IconChevron open={billingOpen} />
              </>
            )}
          </button>

          {!collapsed && billingOpen && (
            <div className="mt-1 ml-4 space-y-1 border-l border-white/20 pl-3">
              <span className="block rounded-lg px-3 py-2 text-sm text-white/55">
                {t("nav.billingContact")}
              </span>
              <span className="block rounded-lg px-3 py-2 text-sm text-white/55">
                {t("nav.billingInfo")}
              </span>
            </div>
          )}
        </div>
      </nav>

      <div className={`border-t border-white/15 py-3 ${collapsed ? "px-2" : "px-3"}`}>
        <button
          type="button"
          onClick={toggleCollapsed}
          className={[
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white",
            collapsed ? "justify-center px-2" : "",
          ].join(" ")}
          aria-label={collapsed ? t("nav.expandMenu") : t("nav.collapseMenu")}
          title={collapsed ? t("nav.expand") : t("nav.collapse")}
        >
          <IconPanel collapsed={collapsed} />
          {!collapsed && <span>{t("nav.collapse")}</span>}
        </button>
      </div>
    </aside>
  );
}
