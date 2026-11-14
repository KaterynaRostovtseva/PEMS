/** Форма входу. Адреса /login. Запит іде в store/apiSlice.ts. */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";
import { apiErrorMessage } from "~/lib/apiError";
import { AuthAlert, AuthField, AuthHeading, AuthShell, authButton, authLink } from "~/components/auth/AuthShell";

function loginError(error: unknown, network: string, fallback: string): string {
  if (error && typeof error === "object" && "status" in error && error.status === "FETCH_ERROR") {
    return network;
  }
  return apiErrorMessage(error, fallback);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));

      if (data.user.role === "OWNER") {
        navigate("/admin/team");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <AuthShell
      image
      imageSrc="/photos/login.jpg"
      imageAlt={t("login.imageAlt")}
      caption={t("auth.aside")}
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <AuthHeading title={t("login.title")} subtitle={t("login.subtitle")} />

        {error && <AuthAlert tone="error">{loginError(error, t("login.network"), t("login.authError"))}</AuthAlert>}

        <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <AuthField
          label={t("login.password")}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className={`text-sm ${authLink}`}>
            {t("login.forgot")}
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className={authButton}>
          {isLoading ? t("login.submitting") : t("login.submit")}
        </button>

        <p className="text-sm text-slate-400">
          {t("login.noAccount")}{" "}
          <Link to="/register" className={authLink}>
            {t("login.register")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
