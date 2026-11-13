/** Рамка сторінок входу: форма в панелі, фото справа на широкому екрані. */
import type { ReactNode } from "react";

export const authLabel = "block text-sm font-medium text-slate-300";

export const authField =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#3E64FF] focus:ring-4 focus:ring-[#3E64FF]/20 disabled:opacity-50";

export const authButton =
  "w-full rounded-xl bg-[#3E64FF] py-3 text-sm font-semibold text-white transition hover:bg-[#3457e6] disabled:cursor-not-allowed disabled:opacity-50";

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
  imageAlt = "",
  caption,
}: {
  children: ReactNode;
  image?: boolean;
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
              src="/register.jpg"
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-slate-950/10 to-slate-950/30 lg:bg-gradient-to-r lg:from-slate-900 lg:via-slate-900/20 lg:to-transparent" />
            <div className="absolute top-4 right-4 rounded-xl bg-[#07122B]/80 px-3 py-2 backdrop-blur-sm">
              <img src="/Logo.svg" alt="PEMS" className="h-5 w-auto" />
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
