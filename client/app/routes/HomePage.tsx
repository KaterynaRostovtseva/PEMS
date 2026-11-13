/** Стартова сторінка: увійти, реєстрація або кабінет. Адреса /. */
import { Link } from "react-router";
import type { Route } from "./+types/HomePage";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PEMS" }];
}

export default function HomePage() {
  const { token, hydrated } = useAppSelector(selectAuth);
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <p className="text-sm font-medium tracking-[0.2em] text-emerald-400">{t("home.kicker")}</p>
      <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight">{t("home.title")}</h1>
      <p className="mt-3 max-w-md text-slate-400">{t("home.subtitle")}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {hydrated && token ? (
          <Link
            to="/dashboard"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold hover:bg-emerald-500"
          >
            {t("home.open")}
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold hover:bg-emerald-500"
            >
              {t("home.login")}
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-slate-700 px-5 py-2.5 font-semibold text-slate-200 hover:bg-slate-900"
            >
              {t("home.register")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
