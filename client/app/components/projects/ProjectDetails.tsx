/** Назва, опис і статус у картці проєкту. */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  type Project,
  type ProjectStatus,
} from "~/store/apiSlice";
import { useLocale, type MessageKey } from "~/lib/i18n";
import {
  PROJECT_STATUSES,
  ProjectTextField,
  projectApiError,
  projectButtonClass,
  projectCardClass,
  projectFieldClass,
} from "./projectUi";

export default function ProjectDetails({
  project,
  canManage,
  isOwner,
  onError,
}: {
  project: Project;
  canManage: boolean;
  isOwner: boolean;
  onError: (message: string) => void;
}) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [updateProject, { isLoading: saving }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  useEffect(() => {
    setName(project.name);
    setDescription(project.description ?? "");
  }, [project]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject({ id: project.id, name, description }).unwrap();
    } catch (err) {
      onError(projectApiError(err, t("project.error")));
    }
  };

  const changeStatus = async (status: ProjectStatus) => {
    try {
      await updateProject({ id: project.id, status }).unwrap();
    } catch (err) {
      onError(projectApiError(err, t("project.error")));
    }
  };

  const removeProject = async () => {
    if (!window.confirm(t("project.deleteConfirm"))) return;
    try {
      await deleteProject(project.id).unwrap();
      navigate("/projects");
    } catch (err) {
      onError(projectApiError(err, t("project.error")));
    }
  };

  return (
    <form onSubmit={save} className={`space-y-4 ${projectCardClass}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#3E64FF]">{project.code}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h1>
        </div>
        {canManage ? (
          <select
            value={project.status}
            onChange={(e) => changeStatus(e.target.value as ProjectStatus)}
            className={projectFieldClass + " w-auto"}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`project.status.${status}` as MessageKey)}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-full bg-[#F4F7FF] px-3 py-1 text-sm font-medium text-[#1C49C0]">
            {t(`project.status.${project.status}` as MessageKey)}
          </span>
        )}
      </div>

      {canManage ? (
        <>
          <ProjectTextField label={t("project.name")} value={name} onChange={setName} required />
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            {t("project.description")}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${projectFieldClass} mt-1.5`}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className={projectButtonClass}>
              {saving ? t("project.saving") : t("project.save")}
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={removeProject}
                className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
              >
                {t("project.delete")}
              </button>
            )}
          </div>
        </>
      ) : (
        project.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
        )
      )}
    </form>
  );
}
