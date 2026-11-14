/** Новий пароль за посиланням з листа. Адреса /reset-password?token=... */
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "~/store/apiSlice";
import { useLocale } from "~/lib/i18n";
import { apiErrorMessage } from "~/lib/apiError";
import { AuthAlert, AuthField, AuthHeading, AuthShell, authButton, authLink } from "~/components/auth/AuthShell";

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
    <AuthShell
      image
      imageSrc="/photos/reset-password.jpg"
      imageAlt={t("forgot.imageAlt")}
      caption={t("auth.aside")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthHeading title={t("reset.title")} subtitle={t("reset.subtitle")} />

        {!token && <AuthAlert tone="warn">{t("reset.missing")}</AuthAlert>}
        {done && <AuthAlert tone="ok">{t("reset.done")}</AuthAlert>}
        {error && <AuthAlert tone="error">{apiErrorMessage(error, t("reset.error"))}</AuthAlert>}

        <AuthField
          label={t("reset.password")}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          strong
          disabled={!token || done}
          required
        />

        <button type="submit" disabled={isLoading || !token || done} className={authButton}>
          {isLoading ? t("reset.submitting") : t("reset.submit")}
        </button>

        <p className="text-sm">
          <Link to="/login" className={authLink}>
            {t("reset.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
