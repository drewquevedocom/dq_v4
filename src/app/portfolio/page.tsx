"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PROJECTS, CATEGORIES, type ProjectCategory } from "@/data/portfolio";
import ProjectCard from "@/components/portfolio/ProjectCard";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");

  useEffect(() => {
    trackEvent("portfolio_view");
  }, []);

  const filtered =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/#home"
            className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <span className="neo-chip">Project Showcase</span>
            <h1 className="mt-5 font-display text-[14vw] uppercase leading-[0.86] tracking-[-0.01em] text-white md:text-[7vw]">
              Portfolio
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-2)]">
              Autonomous systems, GEO-first platforms, and cinematic AI content built to
              convert and scale.
            </p>
          </motion.div>

          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveFilter(cat.id);
                  trackEvent("portfolio_filter", { category: cat.id });
                }}
                className={`neo-chip cursor-pointer transition-all ${
                  activeFilter === cat.id
                    ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                    : "hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-[var(--fg-2)]">
                No projects in this category yet.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
