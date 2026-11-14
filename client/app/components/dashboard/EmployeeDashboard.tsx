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

      <StatGrid columns={3}>
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
      </StatGrid>

      <QuickLinks>
        <QuickLink to="/profile">{t("dash.myProfile")}</QuickLink>
      </QuickLinks>

      <DashboardColumns>
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
      </DashboardColumns>
    </div>
  );
}
