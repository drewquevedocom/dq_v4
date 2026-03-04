"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/portfolio";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      className="neo-card group relative flex flex-col overflow-hidden"
    >
      <div
        className="relative aspect-[16/9] w-full overflow-hidden"
        style={{ backgroundColor: project.imageBg || "var(--bg-2)" }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`transition-transform duration-700 ease-in-out group-hover:scale-105 ${project.imageContain ? "object-contain p-8" : "object-cover"
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(135deg, ${project.accentColor}22 0%, transparent 60%)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-display text-6xl font-bold uppercase tracking-tight opacity-[0.07]"
                style={{ color: project.accentColor }}
              >
                {project.title.split(" ")[0]}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="neo-chip">{project.category.replace("-", " + ")}</span>
          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg-2)] transition hover:text-[var(--accent-cyan)]"
              aria-label={`Visit ${project.title}`}
            >
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>

        <h3 className="font-display text-2xl uppercase leading-tight tracking-wide text-[var(--fg-0)]">
          {project.title}
        </h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-[var(--fg-2)]">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="neo-chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <Link href={`/case-studies/${project.slug}`} className="btn-secondary w-full text-center">
            View Case Study
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
