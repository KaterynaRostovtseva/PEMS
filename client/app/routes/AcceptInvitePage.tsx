/** Прийняття запрошення з листа. Адреса /accept-invite?token=... */
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAcceptInviteMutation } from "~/store/apiSlice";
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

export default function AcceptInvitePage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [acceptInvite, { isLoading, error }] = useAcceptInviteMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await acceptInvite({ token, firstName, lastName, password }).unwrap();
      dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
      navigate(data.user.role === "OWNER" ? "/admin/team" : "/dashboard");
    } catch (err) {
      console.error("Failed to accept invite:", err);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <img src="/Logo.svg" alt="PEMS" className="h-7 w-auto" />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("invite.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("invite.subtitle")}</p>
        </div>

        {!token && <AuthAlert tone="warn">{t("invite.missing")}</AuthAlert>}
        {error && <AuthAlert tone="error">{getErrorMessage(error, t("invite.error"))}</AuthAlert>}

        <div>
          <label className={authLabel}>{t("invite.firstName")}</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={authField}
            required
            autoComplete="given-name"
            disabled={!token}
          />
        </div>

        <div>
          <label className={authLabel}>{t("invite.lastName")}</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={authField}
            required
            autoComplete="family-name"
            disabled={!token}
          />
        </div>

        <div>
          <label className={authLabel}>{t("invite.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authField}
            required
            minLength={6}
            autoComplete="new-password"
            disabled={!token}
          />
        </div>

        <button type="submit" disabled={isLoading || !token} className={authButton}>
          {isLoading ? t("invite.submitting") : t("invite.submit")}
        </button>

        <p className="text-sm">
          <Link to="/login" className="font-medium text-[#9DB4FF] hover:text-white">
            {t("invite.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
