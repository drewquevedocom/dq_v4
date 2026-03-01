"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Film, Palette, Sparkles } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const CREATIVE_WORKS = [
  {
    title: "GEO is the New SEO",
    type: "AI Music Video",
    description:
      "A cinematic music video produced entirely with AI tools — OpenArt.ai, ChatGPT, Suno, and Whisk — demonstrating content velocity at 5% of traditional production cost.",
    icon: <Film className="h-6 w-6 text-[var(--accent-magenta)]" />,
    tags: ["AI Video", "4K", "Suno", "OpenArt"],
    link: "https://youtu.be/swv_QE6E5X4",
    linkLabel: "Watch on YouTube",
    external: true,
  },
  {
    title: "AI Avatar Suite",
    type: "Generative Portraits",
    description:
      "High-fidelity AI-generated brand avatars across 50+ style presets. From professional headshots to cinematic character portraits, generated in under 30 seconds at 4K resolution.",
    icon: <Sparkles className="h-6 w-6 text-[var(--accent-cyan)]" />,
    tags: ["ComfyUI", "4K", "50+ Styles", "Beta"],
    link: "/avatars",
    linkLabel: "Explore Avatars",
  },
  {
    title: "Brand Design Systems",
    type: "Visual Identity",
    description:
      "Complete design systems with tokenized CSS, glass-effect components, and cinematic scroll interactions. Built for brands that demand premium aesthetics with conversion-first architecture.",
    icon: <Palette className="h-6 w-6 text-[var(--accent-green)]" />,
    tags: ["Design Tokens", "GSAP", "Tailwind", "Framer Motion"],
    link: "/portfolio",
    linkLabel: "View Portfolio",
  },
];

export default function CreativePage() {
  useEffect(() => {
    trackEvent("creative_page_view");
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
            <span className="neo-chip">Creative AI</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              Creative Portfolio
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              Merging high-fidelity creative content with technical dominance. We make the future beautiful and discoverable.
            </p>
          </motion.div>

          <div className="space-y-6">
            {CREATIVE_WORKS.map((work, i) => (
              <motion.div
                key={work.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="neo-card overflow-hidden p-6 md:p-8"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="rounded-2xl border border-[var(--line)] bg-[rgba(10,15,30,0.82)] p-4">
                    {work.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="font-display text-3xl uppercase tracking-wide text-[var(--fg-0)]">
                        {work.title}
                      </h3>
                      <span className="neo-chip">{work.type}</span>
                    </div>
                    <p className="mt-3 font-body text-sm leading-relaxed text-[var(--fg-2)] md:text-base">
                      {work.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {work.tags.map((tag) => (
                        <span key={tag} className="neo-chip">{tag}</span>
                      ))}
                    </div>
                    <Link
                      href={work.link}
                      {...(work.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="btn-secondary mt-5 inline-flex items-center gap-2"
                      onClick={() => trackEvent("creative_work_click", { title: work.title })}
                    >
                      {work.linkLabel}
                      <ExternalLink size={14} />
                    </Link>
                  </div>
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
            <Link href="/contact" className="btn-primary">
              Start a Creative Project
            </Link>
            <Link href="/portfolio" className="btn-secondary">
              Full Portfolio
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
