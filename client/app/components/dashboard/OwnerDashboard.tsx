/** Дашборд власника: люди, проєкти, години. */
import { Link } from "react-router";
import {
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetTimeEntriesQuery,
} from "~/store/apiSlice";
import { useGetUsersQuery } from "~/store/userApi";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { personName } from "~/lib/personName";
import { useLocale } from "~/lib/i18n";
import {
  DashboardHero,
  Panel,
  ProjectList,
  QuickLink,
  StatCard,
  TimeEntryList,
  unwrapList,
} from "~/components/dashboard/shared";

export default function OwnerDashboard() {
  const { user } = useAppSelector(selectAuth);
  const { data: profile } = useGetProfileQuery();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: timeData, isLoading: timeLoading } = useGetTimeEntriesQuery();

  const projects = unwrapList(projectsData);
  const entries = unwrapList(timeData);
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const owners = users?.filter((u) => u.role === "OWNER").length ?? 0;
  const managers = users?.filter((u) => u.role === "MANAGER").length ?? 0;
  const employees = users?.filter((u) => u.role === "EMPLOYEE").length ?? 0;
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <DashboardHero
        name={personName(profile, "") || personName(user, t("dash.ownerFallback"))}
        role={user?.role}
        subtitle={
          profile?.organization?.name
            ? t("dash.ownerOrg", { name: profile.organization.name })
            : t("dash.ownerOverview")
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("dash.members")}
          value={usersLoading ? "…" : users?.length ?? 0}
          hint={t("dash.roleSplit", { owners, managers, employees })}
        />
        <StatCard
          label={t("dash.projects")}
          value={projectsLoading ? "…" : projects.length}
          hint={t("dash.active", { count: activeProjects })}
        />
        <StatCard
          label={t("dash.timeEntries")}
          value={timeLoading ? "…" : entries.length}
          hint={t("dash.latestOrg")}
        />
        <StatCard label={t("dash.role")} value="OWNER" hint={t("dash.fullAccess")} />
      </div>

      <div className="flex flex-wrap gap-3">
        <QuickLink to="/admin/team" primary>
          {t("dash.manageTeam")}
        </QuickLink>
        <QuickLink to="/profile">{t("dash.profile")}</QuickLink>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title={t("dash.projects")}
          action={
            <Link to="/admin/team" className="text-sm text-[#1C49C0] hover:underline">
              {t("dash.teamLink")}
            </Link>
          }
        >
          <ProjectList projects={projects} isLoading={projectsLoading} />
        </Panel>

        <Panel title={t("dash.latestTime")}>
          <TimeEntryList entries={entries} isLoading={timeLoading} />
        </Panel>
      </div>
    </div>
  );
}
