/** Прийняття запрошення з листа. Адреса /accept-invite?token=... */
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAcceptInviteMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";
import { apiErrorMessage } from "~/lib/apiError";
import { AuthAlert, AuthField, AuthHeading, AuthShell, authButton, authLink } from "~/components/auth/AuthShell";

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
    <AuthShell
      image
      imageSrc="/photos/forgot-password.jpg"
      imageAlt={t("forgot.imageAlt")}
      caption={t("auth.aside")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthHeading title={t("invite.title")} subtitle={t("invite.subtitle")} />

        {!token && <AuthAlert tone="warn">{t("invite.missing")}</AuthAlert>}
        {error && <AuthAlert tone="error">{apiErrorMessage(error, t("invite.error"))}</AuthAlert>}

        <AuthField
          label={t("invite.firstName")}
          value={firstName}
          onChange={setFirstName}
          autoComplete="given-name"
          disabled={!token}
          required
        />
        <AuthField
          label={t("invite.lastName")}
          value={lastName}
          onChange={setLastName}
          autoComplete="family-name"
          disabled={!token}
          required
        />
        <AuthField
          label={t("invite.password")}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          strong
          disabled={!token}
          required
        />

        <button type="submit" disabled={isLoading || !token} className={authButton}>
          {isLoading ? t("invite.submitting") : t("invite.submit")}
        </button>

        <p className="text-sm">
          <Link to="/login" className={authLink}>
            {t("invite.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
