/** Список проєктів. Власник і менеджер створюють, співробітник бачить свої. Адреса /projects. */
import { Link } from "react-router";
import { useGetProjectsQuery } from "~/store/apiSlice";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { useLocale, type MessageKey } from "~/lib/i18n";
import { unwrapList } from "~/components/dashboard/shared";
import ProjectCreateForm from "~/components/projects/ProjectCreateForm";
import { PROJECT_STATUSES } from "~/components/projects/projectUi";
import { CrmRow, CrmTable, PageTitle, crmCell, crmCellMuted, crmCellStrong } from "~/components/ui/CrmTable";

export default function ProjectListPage() {
  const { user } = useAppSelector(selectAuth);
  const canManage = user?.role === "OWNER" || user?.role === "MANAGER";
  const { t } = useLocale();
  const { data, isLoading, error } = useGetProjectsQuery();
  const projects = unwrapList(data);

  return (
    <div className="space-y-6">
      <PageTitle>{t("nav.projects")}</PageTitle>

      {canManage && <ProjectCreateForm />}

      <CrmTable
        columns={[t("project.name"), t("project.code"), t("project.status"), ""]}
        empty={
          isLoading ? (
            <p className="px-4 py-6 text-slate-500">{t("list.loadingProjects")}</p>
          ) : error ? (
            <p className="px-4 py-6 text-red-600">{t("project.error")}</p>
          ) : projects.length === 0 ? (
            <p className="px-4 py-6 text-slate-500">{t("list.noProjects")}</p>
          ) : undefined
        }
      >
        {projects.map((project) => (
          <CrmRow key={project.id}>
            <td className={crmCellStrong}>{project.name}</td>
            <td className={crmCellMuted}>{project.code}</td>
            <td className={`${crmCell} text-[#1C49C0]`}>
              {PROJECT_STATUSES.includes(project.status)
                ? t(`project.status.${project.status}` as MessageKey)
                : project.status}
            </td>
            <td className={`${crmCell} text-right`}>
              <Link to={`/projects/${project.id}`} className="font-medium text-[#3E64FF] hover:underline">
                {t("project.open")}
              </Link>
            </td>
          </CrmRow>
        ))}
      </CrmTable>
    </div>
  );
}
