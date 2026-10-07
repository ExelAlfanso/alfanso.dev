import {
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { getUserRole, hasSession } from "../lib/auth-session";

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const projectsEndpoint = `${apiUrl}/api/cms/projects`;

type ProjectCategory =
  | "APP DEVELOPMENT"
  | "GAME DEVELOPMENT"
  | "WEB DEVELOPMENT";

interface CmsProject {
  categories: string[];
  category: ProjectCategory;
  description: string;
  href: string;
  id?: string;
  img: string;
  name: string;
  workType: "COLLABORATIVE" | "PERSONAL";
}

const emptyProject: CmsProject = {
  categories: [],
  category: "WEB DEVELOPMENT",
  description: "",
  href: "",
  img: "",
  name: "",
  workType: "PERSONAL",
};

function getProjects(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload as CmsProject[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "projects" in payload &&
    Array.isArray(payload.projects)
  ) {
    return payload.projects as CmsProject[];
  }

  return [];
}

async function fetchProjects(signal: AbortSignal): Promise<CmsProject[]> {
  const response = await fetch(projectsEndpoint, {
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("Could not load projects.");
  }

  return getProjects(await response.json());
}

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [editingProject, setEditingProject] = useState<CmsProject | null>(null);
  const [formProject, setFormProject] = useState<CmsProject>(emptyProject);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const categoriesValue = formProject.categories.join(", ");
  const handleProjectInputChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { id, value } = event.currentTarget;

      setFormProject((currentProject) => {
        switch (id) {
          case "name":
            return { ...currentProject, name: value };
          case "category":
            return { ...currentProject, category: value as ProjectCategory };
          case "description":
            return { ...currentProject, description: value };
          case "href":
            return { ...currentProject, href: value };
          case "img":
            return { ...currentProject, img: value };
          case "workType":
            return {
              ...currentProject,
              workType: value as CmsProject["workType"],
            };
          case "categories":
            return {
              ...currentProject,
              categories: value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            };
          default:
            return currentProject;
        }
      });
    },
    []
  );

  useEffect(() => {
    if (getUserRole(session.data) !== "admin") {
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setMessage("");

    fetchProjects(controller.signal)
      .then(setProjects)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setMessage(error instanceof Error ? error.message : "Load failed.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [session.data]);

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const method = editingProject?.id ? "PUT" : "POST";
      const url = editingProject?.id
        ? `${projectsEndpoint}/${editingProject.id}`
        : projectsEndpoint;

      const response = await fetch(url, {
        body: JSON.stringify(formProject),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method,
      });

      if (!response.ok) {
        setMessage("Project save failed.");
        return;
      }

      const savedProject = (await response.json()) as CmsProject;

      setProjects((currentProjects) =>
        editingProject?.id
          ? currentProjects.map((project) =>
              project.id === editingProject.id ? savedProject : project
            )
          : [savedProject, ...currentProjects]
      );
      setEditingProject(null);
      setFormProject(emptyProject);
      setMessage("Project saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Project save failed."
      );
    }
  }

  const deleteProject = useCallback(async (project: CmsProject) => {
    if (!project.id) {
      return;
    }

    try {
      const response = await fetch(`${projectsEndpoint}/${project.id}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("Project delete failed.");
        return;
      }

      setProjects((currentProjects) =>
        currentProjects.filter((item) => item.id !== project.id)
      );
      setMessage("Project deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Project delete failed."
      );
    }
  }, []);

  const handleEditProject = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const selectedProject = projects.find(
        (project) => project.id === event.currentTarget.value
      );
      if (!selectedProject) {
        return;
      }

      setEditingProject(selectedProject);
      setFormProject(selectedProject);
    },
    [projects]
  );

  const handleDeleteProject = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const selectedProject = projects.find(
        (project) => project.id === event.currentTarget.value
      );
      if (selectedProject) {
        await deleteProject(selectedProject);
      }
    },
    [deleteProject, projects]
  );

  function resetProjectForm() {
    setEditingProject(null);
    setFormProject(emptyProject);
  }

  async function logout() {
    await authClient.signOut();
    navigate("/admin/login", { replace: true });
  }

  if (session.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary px-5 text-accent">
        <p className="font-mono">Checking admin session...</p>
      </main>
    );
  }

  if (hasSession(session.data) && getUserRole(session.data) !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary px-5 text-accent">
        <section className="w-full max-w-md rounded-md border border-accent/20 bg-secondary/70 p-6">
          <h1 className="font-bold font-heading text-4xl">Access denied</h1>
          <p className="mt-3 font-mono text-accent/80">
            Your account does not have the admin role.
          </p>
          <button
            className="mt-6 rounded-md border border-accent bg-accent px-4 py-2 font-bold font-mono text-primary transition-colors hover:bg-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </section>
      </main>
    );
  }

  if (getUserRole(session.data) !== "admin") {
    return (
      <Navigate replace state={{ from: location.pathname }} to="/admin/login" />
    );
  }

  return (
    <main className="min-h-screen bg-primary px-5 py-10 text-accent md:px-10 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-accent/20 border-b pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-bold font-heading text-4xl text-accent md:text-6xl">
              CMS Admin
            </h1>
            <p className="mt-2 font-mono text-accent/80">
              Manage projects shown on the portfolio.
            </p>
          </div>
          <button
            className="rounded-md border border-accent/40 px-4 py-2 font-mono text-accent transition-colors hover:border-accent-two hover:text-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </header>

        {Boolean(message) && (
          <p className="font-mono text-accent-two text-sm" role="status">
            {message}
          </p>
        )}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_1fr]">
          <form
            className="rounded-md border border-accent/20 bg-secondary/70 p-5"
            onSubmit={saveProject}
          >
            <h2 className="font-bold font-heading text-2xl">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>

            <label className="mt-5 block font-mono text-sm" htmlFor="name">
              Name
            </label>
            <input
              className="mt-2 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="name"
              onChange={handleProjectInputChange}
              required
              value={formProject.name}
            />

            <label className="mt-4 block font-mono text-sm" htmlFor="category">
              Category
            </label>
            <select
              className="mt-2 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="category"
              onChange={handleProjectInputChange}
              value={formProject.category}
            >
              <option>WEB DEVELOPMENT</option>
              <option>APP DEVELOPMENT</option>
              <option>GAME DEVELOPMENT</option>
            </select>

            <label className="mt-4 block font-mono text-sm" htmlFor="workType">
              Work type
            </label>
            <select
              className="mt-2 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="workType"
              onChange={handleProjectInputChange}
              value={formProject.workType}
            >
              <option value="PERSONAL">Personal Works</option>
              <option value="COLLABORATIVE">Collaborative Works</option>
            </select>

            <label
              className="mt-4 block font-mono text-sm"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="description"
              onChange={handleProjectInputChange}
              required
              value={formProject.description}
            />

            <label className="mt-4 block font-mono text-sm" htmlFor="href">
              Link
            </label>
            <input
              className="mt-2 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="href"
              onChange={handleProjectInputChange}
              required
              type="url"
              value={formProject.href}
            />

            <label className="mt-4 block font-mono text-sm" htmlFor="img">
              R2 image key
            </label>
            <input
              className="mt-2 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="img"
              onChange={handleProjectInputChange}
              placeholder="projects/awarely.png"
              required
              value={formProject.img}
            />

            <label
              className="mt-4 block font-mono text-sm"
              htmlFor="categories"
            >
              Tags
            </label>
            <input
              className="mt-2 w-full rounded-md border border-accent/25 bg-primary px-3 py-2 font-mono text-accent outline-none focus-visible:border-accent-two"
              id="categories"
              onChange={handleProjectInputChange}
              placeholder="React, Hono, D1"
              value={categoriesValue}
            />

            <div className="mt-6 flex gap-3">
              <button
                className="rounded-md border border-accent bg-accent px-4 py-2 font-bold font-mono text-primary transition-colors hover:bg-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
                type="submit"
              >
                Save
              </button>
              {Boolean(editingProject) && (
                <button
                  className="rounded-md border border-accent/40 px-4 py-2 font-mono text-accent hover:border-accent-two hover:text-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
                  onClick={resetProjectForm}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section
            aria-labelledby="projects-heading"
            className="rounded-md border border-accent/20 bg-secondary/70 p-5"
          >
            <h2
              className="font-bold font-heading text-2xl"
              id="projects-heading"
            >
              Projects
            </h2>

            {isLoading ? (
              <p className="mt-5 font-mono">Loading projects...</p>
            ) : (
              <div className="mt-5 grid gap-4">
                {projects.map((project) => (
                  <article
                    className="rounded-md border border-accent/20 bg-primary p-4"
                    key={project.id ?? project.name}
                  >
                    <h3 className="font-heading text-2xl text-accent">
                      {project.name}
                    </h3>
                    <p className="mt-1 font-mono text-accent-two text-xs">
                      {project.category}
                    </p>
                    <p className="mt-3 font-mono text-accent/85 text-sm">
                      {project.description}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button
                        className="rounded-md border border-accent/40 px-3 py-2 font-mono text-accent text-sm hover:border-accent-two hover:text-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
                        onClick={handleEditProject}
                        type="button"
                        value={project.id}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-accent/40 px-3 py-2 font-mono text-accent text-sm hover:border-accent-two hover:text-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
                        disabled={!project.id}
                        onClick={handleDeleteProject}
                        type="button"
                        value={project.id}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
