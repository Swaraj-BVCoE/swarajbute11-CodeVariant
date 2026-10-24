import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { useArchive } from "../features/archive/ArchiveContext";
import { ProjectForm } from "../features/project-form/ProjectForm";
import { mapFormToProject, projectToFormValues } from "../features/project-form/projectMapping";

export function EditProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useArchive();
  const project = projects.find((candidate) => candidate.id === projectId);

  if (!project) return <><PageHeader eyebrow="Update the record" title="Project not found" description="This project may have been removed from the local archive." /><PageContainer><Button asChild variant="secondary"><Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link></Button></PageContainer></>;

  return (
    <>
      <PageHeader eyebrow="Update the record" title={`Edit ${project.name}`} description="Refine the saved context without losing the history that made it meaningful." />
      <PageContainer>
        <ProjectForm
          mode="edit"
          initialValues={projectToFormValues(project)}
          cancelTo={`/projects/${project.id}`}
          onSubmitProject={(values) => {
            const updated = mapFormToProject(values, project);
            const saved = updateProject(updated);
            if (saved) navigate(`/projects/${project.id}`, { replace: true });
            return saved;
          }}
        />
      </PageContainer>
    </>
  );
}
