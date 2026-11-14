/** Реєстрація компанії і власника. Адреса /register. */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCheckEmailMutation, useRegisterMutation } from "~/store/apiSlice";
import { useAppDispatch } from "~/store/hooks";
import { setCredentials } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";
import { apiErrorMessage } from "~/lib/apiError";
import { AuthAlert, AuthField, AuthHeading, AuthShell, authButton, authLink } from "~/components/auth/AuthShell";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [checkEmail] = useCheckEmailMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLocale();

  useEffect(() => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailTaken(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const result = await checkEmail({ email: value }).unwrap();
        if (!cancelled) setEmailTaken(result.taken);
      } catch {
        if (!cancelled) setEmailTaken(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [email, checkEmail]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailTaken) return;
    const value = email.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      try {
        const result = await checkEmail({ email: value }).unwrap();
        if (result.taken) {
          setEmailTaken(true);
          return;
        }
      } catch {
        // реєстрація нижче все одно відхилить зайняту пошту
      }
    }
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
    <AuthShell
      image
      imageSrc="/photos/register.jpg"
      imageAlt={t("register.imageAlt")}
      caption={t("auth.aside")}
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <AuthHeading title={t("register.title")} subtitle={t("register.subtitle")} />

        {error && <AuthAlert tone="error">{apiErrorMessage(error, t("register.error"))}</AuthAlert>}

        <AuthField label={t("register.company")} value={companyName} onChange={setCompanyName} minLength={1} required />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            label={t("register.firstName")}
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
            required
          />
          <AuthField
            label={t("register.lastName")}
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
            required
          />
        </div>

        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
          message={emailTaken ? t("register.emailTaken") : ""}
        />
        <AuthField
          label={t("register.password")}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          strong
          required
        />

        <button type="submit" disabled={isLoading || emailTaken} className={authButton}>
          {isLoading ? t("register.submitting") : t("register.submit")}
        </button>

        <p className="text-sm text-slate-400">
          {t("register.hasAccount")}{" "}
          <Link to="/login" className={authLink}>
            {t("register.login")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
