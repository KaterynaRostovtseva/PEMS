/** Рамка сторінок входу: форма в панелі, фото справа на широкому екрані. */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useFieldError } from "~/lib/fieldError";
import { useLocale } from "~/lib/i18n";

export const authLabel = "block text-sm font-medium text-slate-300";

export const authField =
  "w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#3E64FF] focus:ring-4 focus:ring-[#3E64FF]/20 disabled:opacity-50";

export const authButton =
  "w-full rounded-xl bg-[#3E64FF] py-3 text-sm font-semibold text-white transition hover:bg-[#3457e6] disabled:cursor-not-allowed disabled:opacity-50";

export const authLink = "font-medium text-[#9DB4FF] hover:text-white";

export function AuthHeading({
  title,
  subtitle,
  logo = false,
}: {
  title: string;
  subtitle: string;
  logo?: boolean;
}) {
  return (
    <div>
      {logo && <img src="/icons/Logo.svg" alt="PEMS" className="h-7 w-auto" />}
      <h1 className={`${logo ? "mt-3 " : ""}text-3xl font-semibold tracking-tight`}>{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
    </div>
  );
}

function PasswordEye({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {off ? (
        <>
          <path d="M3 3l18 18" strokeLinecap="round" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" strokeLinecap="round" />
          <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c5 0 9.3 3.1 11 7a11.6 11.6 0 0 1-2.8 3.9M6.1 6.1C4.2 7.4 2.7 9.1 1 12c1.7 3.9 6 7 11 7 1.6 0 3.1-.3 4.5-.9" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  minLength,
  strong = false,
  disabled = false,
  required = false,
  message = "",
}: {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  minLength?: number;
  strong?: boolean;
  disabled?: boolean;
  required?: boolean;
  message?: string;
}) {
  const { t } = useLocale();
  const id = useId();
  const [visible, setVisible] = useState(false);
  const { ref, error, onBlur } = useFieldError<HTMLInputElement>(value, {
    required,
    type,
    minLength,
    strong,
  });
  const messageRef = useRef(message);
  messageRef.current = message;
  const isPassword = type === "password";
  const shown = error || message;

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    const onSubmit = (event: Event) => {
      if (!messageRef.current) return;
      event.preventDefault();
      event.stopPropagation();
    };
    form.addEventListener("submit", onSubmit, true);
    return () => form.removeEventListener("submit", onSubmit, true);
  }, [ref]);

  return (
    <div>
      <label className={authLabel} htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          ref={ref}
          id={id}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${authField} ${isPassword ? "pr-11" : ""} ${shown ? "!border-red-400 focus:!border-red-400 focus:!ring-red-400/20" : ""}`}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={shown ? true : undefined}
          aria-describedby={shown ? `${id}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            disabled={disabled}
            aria-label={visible ? t("field.hidePassword") : t("field.showPassword")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-40"
          >
            <PasswordEye off={visible} />
          </button>
        )}
      </div>
      {shown && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
          {shown}
        </p>
      )}
    </div>
  );
}

export function AuthAlert({
  tone,
  children,
}: {
  tone: "error" | "warn" | "ok";
  children: ReactNode;
}) {
  const toneClass = {
    error: "border-red-400/30 bg-red-500/10 text-red-100",
    warn: "border-amber-400/30 bg-amber-500/10 text-amber-50",
    ok: "border-emerald-400/30 bg-emerald-500/10 text-emerald-50",
  }[tone];

  return <div className={`rounded-xl border px-3.5 py-3 text-sm ${toneClass}`}>{children}</div>;
}

export function AuthShell({
  children,
  image = false,
  imageSrc = "/photos/register.jpg",
  imageAlt = "",
  caption,
}: {
  children: ReactNode;
  image?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#3E64FF]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div
        className={`relative grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 shadow-[0_40px_90px_-36px_rgba(0,0,0,0.85)] ${
          image ? "max-w-6xl lg:grid-cols-2" : "max-w-[440px]"
        }`}
      >
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">{children}</div>

        {image && (
          <div className="relative order-first min-h-56 lg:order-none lg:min-h-[640px]">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-slate-950/10 to-slate-950/30 lg:bg-gradient-to-r lg:from-slate-900 lg:via-slate-900/20 lg:to-transparent" />
            <div className="absolute top-4 right-4 rounded-xl bg-[#07122B]/80 px-3 py-2 backdrop-blur-sm">
              <img src="/icons/Logo.svg" alt="PEMS" className="h-5 w-auto" />
            </div>
            {caption && (
              <p className="absolute bottom-5 left-5 right-5 text-lg font-medium leading-snug tracking-tight text-white sm:bottom-8 sm:left-8 sm:right-8 sm:max-w-xs sm:text-2xl">
                {caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
