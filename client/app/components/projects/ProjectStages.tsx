/** Список стадій у картці проєкту. */
import { useState } from "react";
import {
  useCreateStageMutation,
  useDeleteStageMutation,
  useGetStagesQuery,
  useUpdateStageMutation,
  type StageStatus,
} from "~/store/apiSlice";
import { useLocale, type MessageKey } from "~/lib/i18n";
import {
  STAGE_STATUSES,
  ProjectTextField,
  projectApiError,
  projectButtonClass,
  projectCardClass,
  projectFieldClass,
} from "./projectUi";

export default function ProjectStages({
  projectId,
  canManage,
  isOwner,
  onError,
}: {
  projectId: string;
  canManage: boolean;
  isOwner: boolean;
  onError: (message: string) => void;
}) {
  const { t } = useLocale();
  const { data: stages = [] } = useGetStagesQuery(projectId);
  const [createStage, { isLoading }] = useCreateStageMutation();
  const [updateStage] = useUpdateStageMutation();
  const [deleteStage] = useDeleteStageMutation();
  const [name, setName] = useState("");

  const fail = (err: unknown) => onError(projectApiError(err, t("project.error")));

  const addStage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStage({ projectId, name, order: stages.length }).unwrap();
      setName("");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <section className={projectCardClass}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("project.stages")}</h2>
      {canManage && (
        <form onSubmit={addStage} className="mt-4 flex items-start gap-2">
          <ProjectTextField
            value={name}
            onChange={setName}
            placeholder={t("project.stageName")}
            required
            className="min-w-0 flex-1"
          />
          <button type="submit" disabled={isLoading} className={`${projectButtonClass} shrink-0 py-2`}>
            {t("project.addStage")}
          </button>
        </form>
      )}
      {stages.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{t("project.noStages")}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {stages.map((stage) => (
            <li
              key={stage.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950"
            >
              <span className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {stage.name}
              </span>
              <div className="flex items-center gap-2">
                {canManage ? (
                  <select
                    value={stage.status}
                    onChange={(e) =>
                      updateStage({
                        projectId,
                        stageId: stage.id,
                        status: e.target.value as StageStatus,
                      })
                        .unwrap()
                        .catch(fail)
                    }
                    className={projectFieldClass + " w-auto"}
                  >
                    {STAGE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t(`stage.status.${status}` as MessageKey)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-slate-500">
                    {t(`stage.status.${stage.status}` as MessageKey)}
                  </span>
                )}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => deleteStage({ projectId, stageId: stage.id }).unwrap().catch(fail)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {t("project.remove")}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
