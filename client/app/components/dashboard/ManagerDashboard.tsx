/** Дашборд менеджера: проєкти, команда, години без рішення. */
import {
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetTimeEntriesQuery,
} from "~/store/apiSlice";
import { useGetUsersQuery } from "~/store/userApi";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { personName } from "~/lib/personName";
import { useLocale, type MessageKey } from "~/lib/i18n";
import {
  DashboardColumns,
  DashboardHero,
  Panel,
  ProjectList,
  QuickLink,
  QuickLinks,
  StatCard,
  StatGrid,
  TimeEntryList,
  unwrapList,
} from "~/components/dashboard/shared";

export default function ManagerDashboard() {
  const { user } = useAppSelector(selectAuth);
  const { data: profile } = useGetProfileQuery();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: timeData, isLoading: timeLoading } = useGetTimeEntriesQuery();

  const projects = unwrapList(projectsData);
  const entries = unwrapList(timeData);
  const pending = entries.filter(
    (e) => e.status === "PENDING" || e.status === "SUBMITTED"
  ).length;
  const team = users?.filter((u) => u.role !== "OWNER") ?? [];
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <DashboardHero
        name={personName(profile, "") || personName(user, t("dash.managerFallback"))}
        role={user?.role}
        subtitle={t("dash.managerSubtitle")}
      />

      <StatGrid>
        <StatCard
          label={t("dash.projects")}
          value={projectsLoading ? "…" : projects.length}
          hint={t("dash.allProjects")}
        />
        <StatCard
          label={t("dash.team")}
          value={usersLoading ? "…" : team.length}
          hint={t("dash.withoutOwners")}
        />
        <StatCard
          label={t("dash.timeEntries")}
          value={timeLoading ? "…" : entries.length}
          hint={t("dash.forReview")}
        />
        <StatCard
          label={t("dash.waiting")}
          value={timeLoading ? "…" : pending}
          hint={t("dash.pendingHint")}
        />
      </StatGrid>

      <QuickLinks>
        <QuickLink to="/admin/team" primary>
          {t("dash.viewTeam")}
        </QuickLink>
        <QuickLink to="/profile">{t("dash.profile")}</QuickLink>
      </QuickLinks>

      <DashboardColumns>
        <Panel title={t("dash.projects")}>
          <ProjectList projects={projects} isLoading={projectsLoading} />
        </Panel>

        <Panel title={t("dash.teamTime")}>
          <TimeEntryList entries={entries} isLoading={timeLoading} />
        </Panel>
      </DashboardColumns>

      <Panel title={t("dash.teamRoster")}>
        {usersLoading ? (
          <p className="text-slate-500 dark:text-slate-400">{t("shell.loading")}</p>
        ) : team.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">{t("dash.noMembers")}</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {team.slice(0, 8).map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {personName(member)}
                  </div>
                  <div className="text-xs text-slate-400">{member.email}</div>
                </div>
                <span className="text-xs font-semibold tracking-wide text-[#1C49C0]">
                  {member.role === "OWNER" ||
                  member.role === "MANAGER" ||
                  member.role === "EMPLOYEE"
                    ? t(`role.${member.role}` as MessageKey)
                    : member.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
