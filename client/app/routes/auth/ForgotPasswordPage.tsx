/** Запит листа для скидання пароля. Адреса /forgot-password. */
import { useState } from "react";
import { Link } from "react-router";
import { useForgotPasswordMutation } from "~/store/apiSlice";
import { useLocale } from "~/lib/i18n";
import { apiErrorMessage } from "~/lib/apiError";
import { AuthAlert, AuthField, AuthHeading, AuthShell, authButton, authLink } from "~/components/auth/AuthShell";

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
    <AuthShell
      image
      imageSrc="/photos/forgot-password.jpg"
      imageAlt={t("forgot.imageAlt")}
      caption={t("auth.aside")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthHeading title={t("forgot.title")} subtitle={t("forgot.subtitle")} />

        {done && <AuthAlert tone="ok">{t("forgot.done")}</AuthAlert>}
        {error && <AuthAlert tone="error">{apiErrorMessage(error, t("forgot.error"))}</AuthAlert>}

        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          disabled={done}
          required
        />

        <button type="submit" disabled={isLoading || done} className={authButton}>
          {isLoading ? t("forgot.submitting") : t("forgot.submit")}
        </button>

        <p className="text-sm">
          <Link to="/login" className={authLink}>
            {t("forgot.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
