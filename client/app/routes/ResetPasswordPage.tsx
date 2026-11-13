/** Новий пароль за посиланням з листа. Адреса /reset-password?token=... */
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "~/store/apiSlice";
import { useLocale } from "~/lib/i18n";
import { AuthAlert, AuthShell, authButton, authField, authLabel } from "~/components/AuthShell";

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "error" in error.data
  ) {
    return String((error.data as { error: string }).error);
  }
  return fallback;
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ token, password }).unwrap();
      setDone(true);
    } catch (err) {
      console.error("Failed to reset password:", err);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <img src="/Logo.svg" alt="PEMS" className="h-7 w-auto" />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("reset.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("reset.subtitle")}</p>
        </div>

        {!token && <AuthAlert tone="warn">{t("reset.missing")}</AuthAlert>}
        {done && <AuthAlert tone="ok">{t("reset.done")}</AuthAlert>}
        {error && <AuthAlert tone="error">{getErrorMessage(error, t("reset.error"))}</AuthAlert>}

        <div>
          <label className={authLabel}>{t("reset.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authField}
            required
            minLength={6}
            autoComplete="new-password"
            disabled={!token || done}
          />
        </div>

        <button type="submit" disabled={isLoading || !token || done} className={authButton}>
          {isLoading ? t("reset.submitting") : t("reset.submit")}
        </button>

        <p className="text-sm">
          <Link to="/login" className="font-medium text-[#9DB4FF] hover:text-white">
            {t("reset.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
