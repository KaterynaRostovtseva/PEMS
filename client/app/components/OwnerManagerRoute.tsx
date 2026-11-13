/** Пускає OWNER і MANAGER. Співробітника повертає на /dashboard. */
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";

export default function OwnerManagerRoute() {
  const { user, hydrated, token } = useAppSelector(selectAuth);
  const { t } = useLocale();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        {t("shell.loading")}
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "OWNER" && user?.role !== "MANAGER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
