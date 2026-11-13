/** Таблиця людей компанії. Роль змінює лише OWNER. Адреса /admin/team. */
import { useGetUsersQuery, useUpdateUserRoleMutation, type UserRole } from "~/store/userApi";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { personName } from "~/lib/personName";
import { useLocale } from "~/lib/i18n";

export default function TeamPage() {
  const { user: currentUser } = useAppSelector(selectAuth);
  const canChangeRole = currentUser?.role === "OWNER";
  const { t } = useLocale();
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "error" in err.data
          ? String((err.data as { error: string }).error)
          : t("team.roleError");
      alert(message);
    }
  };

  if (isLoading) {
    return <p className="text-slate-500 dark:text-slate-400">{t("shell.loading")}</p>;
  }

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {t("team.loadError")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {t("team.title")}
      </h1>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(28,73,192,0.55)] dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4F7FF] text-[#1C49C0] dark:bg-slate-950 dark:text-[#9DB4FF]">
            <tr>
              <th className="px-4 py-3 font-medium">{t("team.name")}</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">{t("team.role")}</th>
              {canChangeRole && (
                <th className="px-4 py-3 font-medium">{t("team.changeRole")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-800 dark:text-slate-100">
                  {personName(user)}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {user.email}
                </td>
                <td className="px-4 py-3 font-semibold text-[#1C49C0]">{user.role}</td>
                {canChangeRole && (
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as UserRole)
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option value="EMPLOYEE">{t("role.EMPLOYEE")}</option>
                      <option value="MANAGER">{t("role.MANAGER")}</option>
                      <option value="OWNER">{t("role.OWNER")}</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
