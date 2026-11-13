/** Меню користувача в шапці: ім'я, роль, профіль, вихід. */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogoutMutation } from "~/store/apiSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { logout, selectAuth } from "~/store/authSlice";
import { personInitial, personName } from "~/lib/personName";
import { useLocale, type MessageKey } from "~/lib/i18n";

function IconChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`size-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0" aria-hidden>
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0" aria-hidden>
      <path
        d="M10 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2M3 12h11M7 8l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UserMenu() {
  const { user } = useAppSelector(selectAuth);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const { t } = useLocale();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logoutApi().unwrap();
    } catch {
      // навіть якщо мережа впала — чистимо локально
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="size-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-[#1C49C0] text-sm font-semibold text-white">
            {personInitial(user) || "?"}
          </div>
        )}
        <div className="hidden text-left sm:block">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {personName(user, t("menu.user"))}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "EMPLOYEE"
              ? t(`role.${user.role}` as MessageKey)
              : user?.role}
          </div>
        </div>
        <IconChevronDown open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <IconUser />
            {t("menu.profile")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <IconLogout />
            {t("menu.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
