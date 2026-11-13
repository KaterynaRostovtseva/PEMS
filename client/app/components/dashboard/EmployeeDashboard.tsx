/** Дашборд співробітника: свої проєкти і свої години. */
import {
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetTimeEntriesQuery,
} from "~/store/apiSlice";
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

export default function EmployeeDashboard() {
  const { user } = useAppSelector(selectAuth);
  const { data: profile } = useGetProfileQuery();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: timeData, isLoading: timeLoading } = useGetTimeEntriesQuery();

  const projects = unwrapList(projectsData);
  const entries = unwrapList(timeData);
  const totalHours = entries.reduce((sum, e) => sum + (e.hours ?? 0), 0);
  const approved = entries.filter((e) => e.status === "APPROVED").length;
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <DashboardHero
        name={personName(profile, "") || personName(user, t("dash.employeeFallback"))}
        role={user?.role}
        subtitle={t("dash.employeeSubtitle")}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={t("dash.myProjects")}
          value={projectsLoading ? "…" : projects.length}
          hint={t("dash.whereAdded")}
        />
        <StatCard
          label={t("dash.myHours")}
          value={timeLoading ? "…" : totalHours}
          hint={t("dash.recentEntries")}
        />
        <StatCard
          label={t("dash.approved")}
          value={timeLoading ? "…" : approved}
          hint={t("dash.approvedHint")}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <QuickLink to="/profile">{t("dash.myProfile")}</QuickLink>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t("dash.myProjects")}>
          <ProjectList
            projects={projects}
            isLoading={projectsLoading}
            emptyText={t("dash.notInProjects")}
          />
        </Panel>

        <Panel title={t("dash.myTime")}>
          <TimeEntryList entries={entries} isLoading={timeLoading} />
        </Panel>
      </div>
    </div>
  );
}
