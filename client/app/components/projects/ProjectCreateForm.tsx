/** Форма нового проєкту на сторінці списку. */
import { useState } from "react";
import { useCreateProjectMutation } from "~/store/apiSlice";
import { useLocale } from "~/lib/i18n";
import { ProjectTextField, projectApiError, projectButtonClass, projectCardClass, projectFieldClass } from "./projectUi";

export default function ProjectCreateForm() {
  const { t } = useLocale();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createProject({
        name,
        code,
        description: description.trim() || undefined,
      }).unwrap();
      setName("");
      setCode("");
      setDescription("");
    } catch (err) {
      setError(projectApiError(err, t("project.error")));
    }
  };

  return (
    <form onSubmit={handleCreate} className={`space-y-4 ${projectCardClass}`}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("project.new")}</h2>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <ProjectTextField label={t("project.name")} value={name} onChange={setName} required />
        <ProjectTextField label={t("project.code")} value={code} onChange={setCode} required />
      </div>
      <label className="block text-sm text-slate-600 dark:text-slate-300">
        {t("project.description")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`${projectFieldClass} mt-1.5`}
        />
      </label>
      <button type="submit" disabled={isLoading} className={projectButtonClass}>
        {isLoading ? t("project.creating") : t("project.create")}
      </button>
    </form>
  );
}
