/** Картка проєкту: опис, стадії і команда. Адреса /projects/:projectId. */
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useGetProjectQuery } from "~/store/apiSlice";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";
import { useLocale } from "~/lib/i18n";
import ProjectDetails from "~/components/projects/ProjectDetails";
import ProjectMembers from "~/components/projects/ProjectMembers";
import ProjectStages from "~/components/projects/ProjectStages";

export default function ProjectCardPage() {
  const { projectId = "" } = useParams();
  const { user } = useAppSelector(selectAuth);
  const canManage = user?.role === "OWNER" || user?.role === "MANAGER";
  const isOwner = user?.role === "OWNER";
  const { t } = useLocale();
  const { data: project, isLoading, error } = useGetProjectQuery(projectId, { skip: !projectId });
  const [actionError, setActionError] = useState("");

  if (isLoading) {
    return <p className="text-slate-500">{t("shell.loading")}</p>;
  }

  if (error || !project) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">{t("project.notFound")}</p>
        <Link to="/projects" className="text-sm font-medium text-[#3E64FF] hover:underline">
          {t("project.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm font-medium text-[#3E64FF] hover:underline">
        {t("project.back")}
      </Link>

      {actionError && <p className="text-sm text-red-600 dark:text-red-400">{actionError}</p>}

      <ProjectDetails
        project={project}
        canManage={canManage}
        isOwner={isOwner}
        onError={setActionError}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectStages
          projectId={projectId}
          canManage={canManage}
          isOwner={isOwner}
          onError={setActionError}
        />
        <ProjectMembers projectId={projectId} canManage={canManage} onError={setActionError} />
      </div>
    </div>
  );
}
