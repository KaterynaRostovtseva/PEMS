/** Реєстрація компанії і власника. Адреса /register. */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
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

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLocale();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register({
        companyName,
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
      navigate("/admin/team");
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };

  return (
    <AuthShell image imageAlt={t("register.imageAlt")} caption={t("auth.aside")}>
      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("register.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("register.subtitle")}</p>
        </div>

        {error && <AuthAlert tone="error">{getErrorMessage(error, t("register.error"))}</AuthAlert>}

        <div>
          <label className={authLabel}>{t("register.company")}</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={authField}
            required
            minLength={1}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={authLabel}>{t("register.firstName")}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={authField}
              required
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className={authLabel}>{t("register.lastName")}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={authField}
              required
              autoComplete="family-name"
            />
          </div>
        </div>

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
          <label className={authLabel}>{t("register.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authField}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={isLoading} className={authButton}>
          {isLoading ? t("register.submitting") : t("register.submit")}
        </button>

        <p className="text-sm text-slate-400">
          {t("register.hasAccount")}{" "}
          <Link to="/login" className="font-medium text-[#9DB4FF] hover:text-white">
            {t("register.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
