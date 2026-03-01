"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Zap, Image as ImageIcon, Layers } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const FEATURES = [
  {
    title: "50+ Style Presets",
    description: "Professional headshots, cinematic portraits, editorial looks, abstract art styles, and industry-specific variations.",
    icon: <Layers className="h-5 w-5 text-[var(--accent-magenta)]" />,
  },
  {
    title: "Under 30 Seconds",
    description: "From reference photo to finished avatar in seconds. No waiting, no manual editing, no back-and-forth with designers.",
    icon: <Zap className="h-5 w-5 text-[var(--accent-cyan)]" />,
  },
  {
    title: "4K Resolution",
    description: "Every avatar is generated at 4K resolution, ready for print, social media, presentations, and digital identity.",
    icon: <ImageIcon className="h-5 w-5 text-[var(--accent-green)]" />,
  },
  {
    title: "Brand Consistency",
    description: "Train on your brand colors, style guides, and visual identity for avatars that match your existing presence.",
    icon: <Sparkles className="h-5 w-5 text-[var(--accent-magenta)]" />,
  },
];

export default function AvatarsPage() {
  useEffect(() => {
    trackEvent("avatars_page_view");
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-5xl">
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
            <div className="flex items-center gap-3">
              <span className="neo-chip">Coming Soon</span>
              <span className="neo-chip border-[rgba(168,85,247,0.5)] text-[var(--accent-magenta)]">Beta</span>
            </div>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              AI Avatar Suite
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              Next-gen AI-generated brand avatars for personal branding, corporate identity, and digital presence. One reference set, unlimited professional-grade outputs.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="neo-card p-5 md:p-6"
              >
                <div className="mb-3 rounded-xl border border-[var(--line)] bg-[rgba(10,15,30,0.82)] p-2.5 w-fit">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide text-[var(--fg-0)]">
                  {feature.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[var(--fg-2)]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neo-card mt-10 p-6 text-center md:p-10"
          >
            <h2 className="font-display text-3xl uppercase tracking-wide text-[var(--fg-0)]">
              Get Early Access
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-relaxed text-[var(--fg-2)]">
              The AI Avatar Suite is currently in beta. Join the waitlist to be among the first to generate your professional AI avatars.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="btn-primary"
                onClick={() => trackEvent("avatars_waitlist_click")}
              >
                Join Waitlist
              </Link>
              <Link href="/creative" className="btn-secondary">
                Browse Creative Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
