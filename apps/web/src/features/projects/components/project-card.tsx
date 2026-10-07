import { motion } from "motion/react";
import { getProjectImagePath } from "../data/project-image-path";
import type { ProjectItem } from "../types/project";

interface ProjectCardProps {
  onOpenProject: (project: ProjectItem, trigger: HTMLButtonElement) => void;
  project: ProjectItem;
}

export default function ProjectCard({
  project,
  onOpenProject,
}: ProjectCardProps) {
  return (
    <motion.article
      className="group min-w-0 overflow-hidden rounded-md border border-accent/20 bg-secondary/70"
      layout
    >
      <button
        className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
        onClick={(event) => onOpenProject(project, event.currentTarget)}
        type="button"
      >
        <span className="block overflow-hidden">
          <img
            alt={`${project.name} project screenshot`}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            decoding="async"
            height="360"
            loading="lazy"
            src={getProjectImagePath(project.img)}
            width="640"
          />
        </span>
        <span className="block min-w-0 p-4">
          <span className="block font-heading text-accent text-wrap-balance text-xl leading-tight">
            {project.name}
          </span>
          <span className="mt-2 block font-mono text-accent-two text-xs uppercase tracking-wide">
            {project.category}
          </span>
          <span className="mt-3 line-clamp-3 block font-mono text-accent/85 text-sm leading-relaxed">
            {project.description}
          </span>
          <span className="mt-4 inline-flex items-center gap-2 font-mono font-semibold text-accent-two text-sm">
            View Project
          </span>
        </span>
      </button>
    </motion.article>
  );
}
