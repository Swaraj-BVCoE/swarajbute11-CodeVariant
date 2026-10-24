import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { useArchive } from "../features/archive/ArchiveContext";
import { ProjectForm } from "../features/project-form/ProjectForm";
import { mapFormToProject } from "../features/project-form/projectMapping";
import { emptyProjectFormValues } from "../features/project-form/projectFormSchema";

export function AddProjectPage() {
  const { createProject } = useArchive();
  const navigate = useNavigate();
  return (
    <>
      <PageHeader eyebrow="Preserve the context" title="Add a sleeping project" description="Record the idea, the progress, and the precise point where momentum faded." />
      <PageContainer>
        <ProjectForm
          mode="create"
          initialValues={emptyProjectFormValues}
          cancelTo="/"
          onSubmitProject={(values) => {
            const project = mapFormToProject(values);
            const saved = createProject(project);
            if (saved) navigate(`/projects/${project.id}`, { replace: true });
            return saved;
          }}
        />
      </PageContainer>
    </>
  );
}
