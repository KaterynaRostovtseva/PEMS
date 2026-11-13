/** Форма входу. Адреса /login. Запит іде в store/apiSlice.ts. */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
import { useLocale, type MessageKey } from "~/lib/i18n";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <div className="mb-2 text-center">
          <p className="text-sm font-medium tracking-wide text-emerald-400">PEMS</p>
          <h1 className="mt-1 text-2xl font-bold">{t("login.title")}</h1>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {getErrorMessage(error, t)}
          </div>
        )}

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
          <label className="mb-1 block text-sm text-slate-300">{t("login.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-emerald-600 py-2.5 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {isLoading ? t("login.submitting") : t("login.submit")}
        </button>

        <p className="text-center text-sm text-slate-400">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            {t("login.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
