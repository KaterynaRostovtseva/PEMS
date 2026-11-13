/** Реєстрація компанії і власника. Адреса /register. */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <div className="mb-2 text-center">
          <p className="text-sm font-medium tracking-wide text-emerald-400">PEMS</p>
          <h1 className="mt-1 text-2xl font-bold">{t("register.title")}</h1>
          <p className="mt-1 text-sm text-slate-400">{t("register.subtitle")}</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {getErrorMessage(error, t("register.error"))}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-slate-300">{t("register.company")}</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            required
            minLength={1}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-slate-300">{t("register.firstName")}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              required
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">{t("register.lastName")}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              required
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">{t("register.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-emerald-600 py-2.5 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {isLoading ? t("register.submitting") : t("register.submit")}
        </button>

        <p className="text-center text-sm text-slate-400">
          {t("register.hasAccount")}{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            {t("register.login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
