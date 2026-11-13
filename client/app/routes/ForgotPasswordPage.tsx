/** Запит листа для скидання пароля. Адреса /forgot-password. */
import { useState } from "react";
import { Link } from "react-router";
import { useForgotPasswordMutation } from "~/store/apiSlice";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setDone(true);
    } catch (err) {
      console.error("Failed to request password reset:", err);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <img src="/Logo.svg" alt="PEMS" className="h-7 w-auto" />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("forgot.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("forgot.subtitle")}</p>
        </div>

        {done && <AuthAlert tone="ok">{t("forgot.done")}</AuthAlert>}
        {error && <AuthAlert tone="error">{getErrorMessage(error, t("forgot.error"))}</AuthAlert>}

        <div>
          <label className={authLabel}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authField}
            required
            autoComplete="email"
            disabled={done}
          />
        </div>

        <button type="submit" disabled={isLoading || done} className={authButton}>
          {isLoading ? t("forgot.submitting") : t("forgot.submit")}
        </button>

        <p className="text-sm">
          <Link to="/login" className="font-medium text-[#9DB4FF] hover:text-white">
            {t("forgot.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
