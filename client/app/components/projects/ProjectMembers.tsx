/** Команда проєкту в картці. */
import { useState } from "react";
import {
  useAddMemberMutation,
  useGetMembersQuery,
  useRemoveMemberMutation,
  type ProjectRoleName,
} from "~/store/apiSlice";
import { useGetUsersQuery } from "~/store/userApi";
import { personName } from "~/lib/personName";
import { useFieldError } from "~/lib/fieldError";
import { useLocale, type MessageKey } from "~/lib/i18n";
import {
  PROJECT_ROLES,
  projectApiError,
  projectButtonClass,
  projectCardClass,
  projectFieldClass,
} from "./projectUi";

export default function ProjectMembers({
  projectId,
  canManage,
  onError,
}: {
  projectId: string;
  canManage: boolean;
  onError: (message: string) => void;
}) {
  const { t } = useLocale();
  const { data: members = [] } = useGetMembersQuery(projectId);
  const { data: users = [] } = useGetUsersQuery(undefined, { skip: !canManage });
  const [addMember, { isLoading }] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [userId, setUserId] = useState("");
  const [roleInProject, setRoleInProject] = useState<ProjectRoleName>("DEVELOPER");
  const userField = useFieldError<HTMLSelectElement>(userId, { required: true });

  const memberIds = new Set(members.map((member) => member.userId));
  const available = users.filter((person) => person.isActive !== false && !memberIds.has(person.id));
  const fail = (err: unknown) => onError(projectApiError(err, t("project.error")));

  const assign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await addMember({ projectId, userId, roleInProject }).unwrap();
      setUserId("");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <section className={projectCardClass}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("project.members")}</h2>
      {canManage && (
        <form onSubmit={assign} className="mt-4 flex flex-wrap gap-2">
          <div className="min-w-40 flex-1">
            <select
              ref={userField.ref}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onBlur={userField.onBlur}
              aria-invalid={userField.error ? true : undefined}
              className={`${projectFieldClass} ${userField.error ? "!border-red-400 focus:!border-red-400" : ""}`}
            >
              <option value="">{t("project.pickUser")}</option>
              {available.map((person) => (
                <option key={person.id} value={person.id}>
                  {personName(person, person.email)}
                </option>
              ))}
            </select>
            {userField.error && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{userField.error}</p>
            )}
          </div>
          <select
            value={roleInProject}
            onChange={(e) => setRoleInProject(e.target.value as ProjectRoleName)}
            className={projectFieldClass + " w-auto"}
          >
            {PROJECT_ROLES.map((role) => (
              <option key={role} value={role}>
                {t(`roleIn.${role}` as MessageKey)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isLoading || available.length === 0}
            className={`${projectButtonClass} py-2`}
          >
            {t("project.addMember")}
          </button>
        </form>
      )}
      {members.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{t("project.noMembers")}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {personName(member.user, member.user.email)}
                </div>
                <div className="text-xs text-slate-500">
                  {member.roleInProject
                    ? t(`roleIn.${member.roleInProject}` as MessageKey)
                    : member.user.email}
                </div>
              </div>
              {canManage && (
                <button
                  type="button"
                  onClick={() => removeMember({ projectId, memberId: member.id }).unwrap().catch(fail)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {t("project.remove")}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
