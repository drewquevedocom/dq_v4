"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, FlaskConical, Search, TrendingUp } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const RESEARCH_AREAS = [
  {
    title: "Generative Engine Optimization",
    description:
      "How LLMs like ChatGPT and Gemini choose which brands to cite. We reverse-engineer citation patterns to build authority signals that AI search engines prioritize over competitors.",
    icon: <Search className="h-6 w-6 text-[var(--accent-green)]" />,
    stats: "4.2x avg citation lift",
  },
  {
    title: "Semantic Architecture",
    description:
      "Structuring content so machines and humans extract meaning effortlessly. FAQ schema, entity relationships, and topical clustering designed for AI comprehension.",
    icon: <BookOpen className="h-6 w-6 text-[var(--accent-cyan)]" />,
    stats: "310% organic traffic increase",
  },
  {
    title: "Answer Engine Optimization",
    description:
      "Engineering the direct answers that appear in AI Overviews, ChatGPT responses, and Gemini recommendations. Position zero for the AI era.",
    icon: <FlaskConical className="h-6 w-6 text-[var(--accent-magenta)]" />,
    stats: "#1 AI Search results",
  },
  {
    title: "Authority Signal Mapping",
    description:
      "Identifying and amplifying the trust signals that AI engines weight most heavily: E-E-A-T, structured data, backlink quality, and entity disambiguation.",
    icon: <TrendingUp className="h-6 w-6 text-[var(--accent-cyan)]" />,
    stats: "23 years of domain signals",
  },
];

export default function ResearchPage() {
  useEffect(() => {
    trackEvent("research_page_view");
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
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
            className="mb-16"
          >
            <span className="neo-chip">The Lab</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              GEO Research
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              We experiment until we find the truth. This is where keywords become authority and rankings become citations. The goal is the same: get seen, get selected, get customers.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {RESEARCH_AREAS.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="neo-card p-6 md:p-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl border border-[var(--line)] bg-[rgba(10,15,30,0.82)] p-3">
                    {area.icon}
                  </div>
                  <span className="neo-chip">{area.stats}</span>
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-[var(--fg-0)]">
                  {area.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-[var(--fg-2)]">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap gap-4"
          >
            <Link href="/audit" className="btn-primary">
              Request an Audit
            </Link>
            <Link href="/lab-results" className="btn-secondary">
              Browse Lab Results
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
