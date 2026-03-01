"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import ProjectCard from "./ProjectCard";
import SectionTitle from "../ui/SectionTitle";
import SectionSubtitle from "../ui/SectionSubtitle";

const FEATURED = PROJECTS.filter((p) => p.featured).slice(0, 3);

export default function PortfolioTeaser() {
  return (
    <section id="portfolio" className="relative z-10 snap-start px-4 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end"
        >
          <div>
            <span className="neo-chip">Recent Projects</span>
            <div className="mt-5">
              <SectionTitle title="Portfolio" pulseWord="Portfolio" titleClassName="text-[clamp(2.5rem,8vw,5.2rem)]" />
            </div>
            <SectionSubtitle
              text="Autonomous systems and GEO-first platforms built to convert."
              keywords={['Autonomous systems', 'GEO-first platforms', 'convert']}
              className="mt-4 max-w-xl text-[var(--fg-2)]"
            />
          </div>
          <Link
            href="/portfolio"
            className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
