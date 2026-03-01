"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const POSTS = [
  {
    title: "GEO is the New SEO: Why AI Citation Matters More Than Rankings",
    excerpt:
      "The goal is the same: get seen, get selected, get customers. But the playing field has shifted. Here is how to win in the age of AI-driven search.",
    date: "2026-02-10",
    tags: ["GEO", "AEO", "Strategy"],
    readTime: "8 min",
  },
  {
    title: "How eConstruct Hit #1 in Google AI Search",
    excerpt:
      "A detailed breakdown of the semantic architecture, FAQ schema, and authority signals that put a construction estimation company at the top of ChatGPT and Gemini results.",
    date: "2026-01-28",
    tags: ["Case Study", "GEO", "Local SEO"],
    readTime: "12 min",
  },
  {
    title: "Building Autonomous Business Systems with Agentic AI",
    excerpt:
      "From LASO Imaging to AgentIQ: how we deploy self-healing ecosystems that eliminate human bottlenecks and run 24/7.",
    date: "2026-01-15",
    tags: ["AI Agents", "Automation", "Engineering"],
    readTime: "10 min",
  },
  {
    title: "Content Velocity: Producing a 4K Music Video in 72 Hours with AI",
    excerpt:
      "OpenArt, Suno, ChatGPT, and Whisk — the AI stack behind our cinematic music video and what it means for content production at scale.",
    date: "2025-12-20",
    tags: ["Creative AI", "Content", "Production"],
    readTime: "6 min",
  },
  {
    title: "The ROI of Presence: Why Automation Should Give You Life Back",
    excerpt:
      "23 years of building taught me that AI should not replace your life — it should give it back. Here is the framework for life-work integration through automation.",
    date: "2025-12-05",
    tags: ["Philosophy", "Automation", "Leadership"],
    readTime: "7 min",
  },
];

export default function BlogPage() {
  useEffect(() => {
    trackEvent("blog_page_view");
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-4xl">
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
            <span className="neo-chip">Dispatches</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              Blog
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              Strategy notes, lab findings, and field reports from 23 years of digital engineering and the frontier of AI-driven marketing.
            </p>
          </motion.div>

          <div className="space-y-4">
            {POSTS.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="neo-card group cursor-pointer p-5 transition hover:border-white/20 md:p-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-[var(--fg-2)]">
                  <time className="font-tech text-[0.6rem] uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span className="flex items-center gap-1 font-tech text-[0.6rem] uppercase tracking-widest">
                    <Clock size={10} />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide text-[var(--fg-0)] transition group-hover:text-white md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-[var(--fg-2)]">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="neo-chip">{tag}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="font-body text-sm text-[var(--fg-2)]">
              More posts coming soon. Follow for updates.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link href="/community" className="btn-secondary">
                Join the AI Lab
              </Link>
              <Link href="/contact" className="btn-primary">
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
