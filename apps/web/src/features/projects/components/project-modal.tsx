import { ExternalLink, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { getProjectImagePath } from "../data/project-image-path";
import type { ProjectItem } from "../types/project";

interface ProjectModalProps {
  onClose: () => void;
  project: ProjectItem;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const [first] = focusable;
      const last = focusable[focusable.length - 1];

      if (!(first && last)) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/70 p-4 backdrop-blur-sm md:p-8"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={onClose}
      role="presentation"
    >
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-labelledby="project-modal-title"
        aria-modal="true"
        className="relative w-full max-w-4xl overflow-hidden rounded-md border border-accent/25 bg-secondary p-5 shadow-2xl md:p-8"
        exit={{ opacity: 0, scale: 0.97, y: 30 }}
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <button
          aria-label="Close project details"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-accent/40 text-accent transition-colors duration-200 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <X aria-hidden="true" size={20} />
        </button>

        <div className="grid max-h-[82vh] gap-6 overflow-y-auto pr-1 md:grid-cols-2 md:gap-8">
          <img
            alt={`${project.name} full preview`}
            className="aspect-video w-full rounded-md object-cover"
            height="540"
            src={getProjectImagePath(project.img)}
            width="960"
          />

          <div className="flex min-w-0 flex-col gap-5 pr-10 md:pr-0">
            <p className="font-mono text-accent-two text-xs uppercase tracking-wide md:text-sm">
              {project.category}
            </p>

            <h3
              className="text-3xl text-accent text-wrap-balance leading-tight md:text-4xl"
              id="project-modal-title"
            >
              {project.name}
            </h3>

            <p className="font-mono text-accent/95 text-sm leading-relaxed md:text-base">
              {project.description}
            </p>

            <div>
              <p className="mb-2 font-mono text-accent/80 text-xs uppercase tracking-wide md:text-sm">
                Categories
              </p>
              <ul className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <li
                    className="rounded-full border border-accent/40 bg-primary/60 px-3 py-1 font-mono text-accent text-xs md:text-sm"
                    key={category}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <a
              className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-two px-4 py-2 font-mono font-semibold text-accent-two text-sm transition-colors duration-200 hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4 md:text-base"
              href={project.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit Project
              <ExternalLink aria-hidden="true" size={16} />
            </a>
            <p className="break-all font-mono text-accent/70 text-xs md:text-sm">
              {project.href}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
