"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const VIDEOS = [
  {
    title: "GEO is the New SEO",
    description:
      "A cinematic AI-generated music video exploring the shift from traditional SEO to Generative Engine Optimization. Produced in 72 hours using OpenArt.ai, Suno, ChatGPT, and Whisk at 5% of traditional production cost.",
    tags: ["AI Music Video", "4K", "GEO"],
    youtubeId: "swv_QE6E5X4",
    featured: true,
    aspect: "16:9" as const,
  },
  {
    title: "Before & After: Retail Construction in LA",
    description:
      "Stunning retail construction transformation — Odd 1 Out Boba Tea Shop by eConstruct Inc. A showcase of precision craftsmanship and design-build excellence in Los Angeles.",
    tags: ["Case Study", "eConstruct", "Construction"],
    youtubeId: "xSOv0Nafzr4",
    featured: false,
    aspect: "16:9" as const,
  },
  {
    title: "ADU Permit Los Angeles",
    description:
      "Your path to building an ADU in the City of Angels. A quick guide to navigating the ADU permit process in Los Angeles by eConstruct Inc.",
    tags: ["ADU", "Los Angeles", "Permits"],
    youtubeId: "KK1fIEJcezk",
    featured: false,
    aspect: "9:16" as const,
  },
];

export default function MediaVideoPage() {
  useEffect(() => {
    trackEvent("media_video_page_view");
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/creative"
            className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Creative
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="neo-chip">Media</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              Video
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              Cinematic content engineered for both human engagement and AI engine citation.
            </p>
          </motion.div>

          <div className="space-y-6">
            {VIDEOS.map((video, i) => (
              <motion.div
                key={video.youtubeId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`neo-card overflow-hidden ${video.featured ? "border-[rgba(168,85,247,0.3)]" : ""}`}
              >
                <div
                  className={`relative w-full ${
                    video.aspect === "9:16"
                      ? "mx-auto max-w-sm aspect-[9/16]"
                      : "aspect-video"
                  }`}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                  {video.featured ? (
                    <div className="pointer-events-none absolute left-4 top-4 z-10">
                      <span className="neo-chip border-[rgba(168,85,247,0.5)] text-[var(--accent-magenta)]">
                        Featured
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[var(--fg-0)]">
                    {video.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-[var(--fg-2)]">
                    {video.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {video.tags.map((tag) => (
                      <span key={tag} className="neo-chip">{tag}</span>
                    ))}
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
            <Link href="/creative" className="btn-secondary">
              All Creative Work
            </Link>
            <Link href="/contact" className="btn-primary">
              Commission a Video
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
