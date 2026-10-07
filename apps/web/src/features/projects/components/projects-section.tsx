import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ProjectItem } from "../types/project";
import ProjectCard from "./project-card";
import ProjectModal from "./project-modal";

interface ProjectsSectionProps {
  id?: string;
}

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

function getProjects(payload: unknown): ProjectItem[] {
  if (
    payload &&
    typeof payload === "object" &&
    "projects" in payload &&
    Array.isArray(payload.projects)
  ) {
    return payload.projects as ProjectItem[];
  }

  return [];
}

export default function ProjectsSection({ id }: ProjectsSectionProps) {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const projectTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch(`${apiUrl}/api/cms/projects`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Projects could not be loaded.");
        }

        setProjects(getProjects(await response.json()));
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Projects could not be loaded."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  const sections = [
    {
      data: projects.filter((project) => project.workType === "PERSONAL"),
      title: "Personal Works",
    },
    {
      data: projects.filter((project) => project.workType === "COLLABORATIVE"),
      title: "Collaborative Works",
    },
  ];

  function openProjectModal(project: ProjectItem, trigger: HTMLButtonElement) {
    projectTriggerRef.current = trigger;
    setActiveProject(project);
  }

  function closeProjectModal() {
    setActiveProject(null);
    requestAnimationFrame(() => projectTriggerRef.current?.focus());
  }

  return (
    <>
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="projects-title"
        className="relative w-full scroll-mt-24 px-5 py-16 md:px-10 lg:px-20"
        id={id || "Projects"}
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ amount: 0.15, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:gap-14">
          <h2
            className="font-bold font-heading text-4xl text-accent text-wrap-balance md:text-6xl"
            id="projects-title"
          >
            Projects
          </h2>

          {isLoading === true ? (
            <p
              aria-live="polite"
              className="font-mono text-accent/80"
              role="status"
            >
              Loading projects...
            </p>
          ) : null}
          {Boolean(errorMessage) && (
            <p className="font-mono text-accent-two" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-12">
            {sections.map((section, sectionIndex) => (
              <motion.section
                animate={{ opacity: 1, y: 0 }}
                aria-labelledby={`${section.title.replaceAll(" ", "-")}-title`}
                className="min-w-0"
                initial={{ opacity: 0, y: 30 }}
                key={section.title}
                transition={{
                  delay: sectionIndex * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                viewport={{ amount: 0.1, once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h3
                  className="mb-5 text-left font-bold font-heading text-2xl text-accent md:text-3xl lg:text-4xl"
                  id={`${section.title.replaceAll(" ", "-")}-title`}
                >
                  {section.title}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.data.map((project) => (
                    <ProjectCard
                      key={project.name}
                      onOpenProject={openProjectModal}
                      project={project}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {activeProject === null ? null : (
          <ProjectModal onClose={closeProjectModal} project={activeProject} />
        )}
      </AnimatePresence>
    </>
  );
}
