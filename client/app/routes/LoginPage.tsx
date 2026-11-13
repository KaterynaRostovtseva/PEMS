/** Форма входу. Адреса /login. Запит іде в store/apiSlice.ts. */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
import { useLocale, type MessageKey } from "~/lib/i18n";
import { AuthAlert, AuthShell, authButton, authField, authLabel } from "~/components/AuthShell";

function getErrorMessage(
  error: unknown,
  t: (key: MessageKey) => string
): string {
  if (error && typeof error === "object" && "status" in error) {
    if (error.status === "FETCH_ERROR") {
      return t("login.network");
    }
    if (
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "error" in error.data
    ) {
      return String((error.data as { error: string }).error);
    }
  }
  return t("login.authError");
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
    <AuthShell image imageAlt={t("register.imageAlt")} caption={t("auth.aside")}>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("login.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("login.subtitle")}</p>
        </div>

        {error && <AuthAlert tone="error">{getErrorMessage(error, t)}</AuthAlert>}

        <div>
          <label className={authLabel}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authField}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className={authLabel}>{t("login.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authField}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-[#9DB4FF] hover:text-white">
            {t("login.forgot")}
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className={authButton}>
          {isLoading ? t("login.submitting") : t("login.submit")}
        </button>

        <p className="text-sm text-slate-400">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="font-medium text-[#9DB4FF] hover:text-white">
            {t("login.register")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
