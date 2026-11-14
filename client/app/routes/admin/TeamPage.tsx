/** Таблиця людей компанії. Роль змінює лише OWNER. Адреса /admin/team. */
import { useGetUsersQuery, useUpdateUserRoleMutation, type UserRole } from "~/store/userApi";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { personName } from "~/lib/personName";
import { useLocale } from "~/lib/i18n";
import { apiErrorMessage } from "~/lib/apiError";
import { CrmRow, CrmTable, PageTitle, crmCell, crmCellMuted, crmCellStrong } from "~/components/ui/CrmTable";

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
      alert(apiErrorMessage(err, t("team.roleError")));
    }
  };

  if (isLoading) {
    return <p className="text-slate-500 dark:text-slate-400">{t("shell.loading")}</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{t("team.loadError")}</p>;
  }

  return (
    <div className="space-y-4">
      <PageTitle>{t("team.title")}</PageTitle>

      <CrmTable
        columns={[
          t("team.name"),
          "Email",
          t("team.role"),
          ...(canChangeRole ? [t("team.changeRole")] : []),
        ]}
      >
        {users?.map((user) => (
          <CrmRow key={user.id}>
            <td className={crmCellStrong}>{personName(user)}</td>
            <td className={crmCellMuted}>{user.email}</td>
            <td className={`${crmCell} font-semibold text-[#1C49C0]`}>{user.role}</td>
            {canChangeRole && (
              <td className={crmCell}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="EMPLOYEE">{t("role.EMPLOYEE")}</option>
                  <option value="MANAGER">{t("role.MANAGER")}</option>
                  <option value="OWNER">{t("role.OWNER")}</option>
                </select>
              </td>
            )}
          </CrmRow>
        ))}
      </CrmTable>
    </div>
  );
}
