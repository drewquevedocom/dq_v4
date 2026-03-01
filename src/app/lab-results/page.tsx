"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const RESULTS = [
  {
    project: "eConstruct Inc",
    metric: "#1 AI Search Result",
    detail: "Achieved top organic position in Google AI Search, ChatGPT, and Gemini for 'restaurant construction Los Angeles'.",
    tags: ["GEO", "Local SEO", "Schema"],
  },
  {
    project: "LASO MRI Solutions",
    metric: "85% Faster Response",
    detail: "Agentic AI reduced vendor response time from hours to minutes with automated procurement workflows powered by n8n and RAG.",
    tags: ["Agentic AI", "RAG", "n8n"],
  },
  {
    project: "AgentIQ Agency",
    metric: "300-500% Client ROI",
    detail: "Autonomous voice agents and outbound sequences deliver qualified leads 24/7, replacing manual outreach for 12+ markets.",
    tags: ["Voice AI", "Telnyx", "LangGraph"],
  },
  {
    project: "GEO Music Video",
    metric: "72hr Production",
    detail: "Full cinematic 4K music video produced with AI tools at 5% of traditional cost, optimized for AI search citation.",
    tags: ["AI Video", "Content Velocity", "YouTube SEO"],
  },
  {
    project: "Citation Authority Study",
    metric: "4.2x Citation Lift",
    detail: "Semantic chunking + FAQ schema + E-E-A-T signals increased AI engine citation rate by 4.2x across test domains.",
    tags: ["GEO", "AEO", "Structured Data"],
  },
  {
    project: "Organic Traffic Study",
    metric: "+310% Traffic Growth",
    detail: "Combined GEO and traditional SEO strategy tripled organic traffic within first quarter of implementation.",
    tags: ["SEO", "GEO", "Content Strategy"],
  },
];

export default function LabResultsPage() {
  useEffect(() => {
    trackEvent("lab_results_page_view");
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/research"
            className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Research
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="neo-chip">Verified Results</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              Lab Results
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              Real outcomes from real projects. Every metric is measured, every result is documented.
            </p>
          </motion.div>

          <div className="space-y-4">
            {RESULTS.map((result, i) => (
              <motion.div
                key={result.project}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="neo-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:p-6"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--accent-green)]" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-display text-xl uppercase tracking-wide text-[var(--fg-0)]">
                      {result.project}
                    </h3>
                    <span className="font-tech text-sm font-bold text-[var(--accent-cyan)]">
                      {result.metric}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-sm leading-relaxed text-[var(--fg-2)]">
                    {result.detail}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.tags.map((tag) => (
                    <span key={tag} className="neo-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Link href="/audit" className="btn-primary">
              Get Your Audit
            </Link>
            <Link href="/portfolio" className="btn-secondary">
              View Portfolio
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
