/** Профіль: ім'я, пошта, роль, організація. Адреса /profile. */
import { useGetProfileQuery } from "~/store/apiSlice";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { personName } from "~/lib/personName";
import { useLocale, type MessageKey } from "~/lib/i18n";
import { PageTitle, crmCardClass } from "~/components/ui/CrmTable";

export default function ProfilePage() {
  const { user } = useAppSelector(selectAuth);
  const { t } = useLocale();
  const { data: profile, isLoading } = useGetProfileQuery();

  const name = personName(profile, "") || personName(user, "—");
  const email = profile?.email || user?.email || "—";
  const roleCode = profile?.role || user?.role;
  const role =
    roleCode === "OWNER" || roleCode === "MANAGER" || roleCode === "EMPLOYEE"
      ? t(`role.${roleCode}` as MessageKey)
      : roleCode || "—";
  const org = profile?.organization?.name;
  const avatar = profile?.avatar || user?.avatar;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageTitle>{t("profile.title")}</PageTitle>

      <section className={crmCardClass}>
        {isLoading ? (
          <p className="text-slate-500 dark:text-slate-400">{t("shell.loading")}</p>
        ) : (
          <div className="flex items-start gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="size-16 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-[#1C49C0] text-xl font-semibold text-white">
                {name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">{t("profile.name")}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{name}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{email}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">{t("profile.role")}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{role}</dd>
              </div>
              {org && (
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">{t("profile.org")}</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{org}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </section>
    </div>
  );
}
