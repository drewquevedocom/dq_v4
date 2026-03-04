"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const project = PROJECTS.find((p) => p.slug === params.slug);

  useEffect(() => {
    if (project) {
      trackEvent("case_study_view", { slug: project.slug });
    }
  }, [project]);

  if (!project) {
    return (
      <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
        <NoiseLayer />
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl uppercase text-[var(--fg-0)]">
              Not Found
            </h1>
            <p className="mt-3 text-[var(--fg-2)]">This case study does not exist.</p>
            <Link href="/portfolio" className="btn-primary mt-6 inline-block">
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      {/* SEO/GEO Metadata injection if provided by the project */}
      {project.seoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: project.seoSchema }}
        />
      )}

      <article className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/portfolio"
            className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
          >
            <ArrowLeft size={14} />
            All Projects
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="neo-chip">{project.category.replace("-", " + ")}</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] text-white md:text-[5vw]">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-lg leading-relaxed text-[var(--fg-1)]">
              {project.tagline}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {project.technologies.map((tech) => (
                <span key={tech} className="neo-chip">
                  {tech}
                </span>
              ))}
              {project.externalUrl ? (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                  onClick={() =>
                    trackEvent("case_study_external_click", {
                      slug: project.slug,
                      url: project.externalUrl!,
                    })
                  }
                >
                  Visit Site
                  <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {project.results.map((result) => (
              <div key={result.label} className="neo-card p-4 text-center">
                <div
                  className="font-display text-3xl font-bold tracking-tight"
                  style={{ color: project.accentColor }}
                >
                  {result.value}
                </div>
                <div className="mt-1 font-tech text-[0.6rem] uppercase tracking-[0.18em] text-[var(--fg-2)]">
                  {result.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Content Sections or Full Rich HTML Content */}
          <div className="mt-16">
            {project.fullContent ? (
              <div
                className="prose prose-invert max-w-none text-[var(--fg-1)] prose-headings:font-display prose-headings:text-white prose-a:text-[var(--accent-cyan)] prose-strong:text-white prose-img:rounded-xl prose-img:shadow-2xl"
                dangerouslySetInnerHTML={{ __html: project.fullContent }}
              />
            ) : (
              <div className="space-y-14">
                {[
                  { title: "The Challenge", content: project.challenge },
                  { title: "The Solution", content: project.solution },
                  { title: "The Outcome", content: project.outcome },
                ].map((section, i) => (
                  <motion.section
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                  >
                    <h2 className="font-display text-3xl uppercase tracking-wide text-[var(--fg-0)] md:text-4xl">
                      {section.title}
                    </h2>
                    <p className="mt-4 font-body text-base leading-relaxed text-[var(--fg-1)]">
                      {section.content}
                    </p>
                  </motion.section>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 flex flex-wrap gap-4 border-t border-[var(--line)] pt-10"
          >
            <Link href="/portfolio" className="btn-secondary">
              More Projects
            </Link>
            <Link href="/#contact" className="btn-primary">
              Start a Project
            </Link>
          </motion.div>
        </div>
      </article>
    </div>
  );
}
