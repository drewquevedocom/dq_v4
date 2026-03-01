"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Beaker, Mic, BookOpen } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const BENEFITS = [
  {
    title: "Weekly Lab Sessions",
    description: "Live experiments with GEO strategies, AI agent builds, and automation workflows. Watch and learn in real-time.",
    icon: <Beaker className="h-5 w-5 text-[var(--accent-green)]" />,
  },
  {
    title: "Private Community",
    description: "Connect with operators, founders, and builders who are actively deploying AI systems in their businesses.",
    icon: <Users className="h-5 w-5 text-[var(--accent-cyan)]" />,
  },
  {
    title: "Office Hours",
    description: "Monthly strategy calls where you can ask questions, get feedback on your AI implementation, and course-correct.",
    icon: <Mic className="h-5 w-5 text-[var(--accent-magenta)]" />,
  },
  {
    title: "Resource Library",
    description: "Templates, prompt libraries, automation recipes, and playbooks from 23 years of digital engineering experience.",
    icon: <BookOpen className="h-5 w-5 text-[var(--accent-cyan)]" />,
  },
];

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "community_signup" }),
      });
      setSubmitted(true);
      trackEvent("community_signup_submitted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-5xl">
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
            <span className="neo-chip">Join the Lab</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[6vw]">
              AI Lab Community
            </h1>
            <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-1)]">
              A private community for operators and founders deploying AI systems. Weekly experiments, shared playbooks, and direct access to 23 years of digital engineering insight.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="neo-card p-5 md:p-6"
              >
                <div className="mb-3 w-fit rounded-xl border border-[var(--line)] bg-[rgba(10,15,30,0.82)] p-2.5">
                  {benefit.icon}
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide text-[var(--fg-0)]">
                  {benefit.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[var(--fg-2)]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neo-card mt-10 p-6 md:p-10"
          >
            <h2 className="font-display text-3xl uppercase tracking-wide text-[var(--fg-0)]">
              Request Access
            </h2>
            <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-[var(--fg-2)]">
              The AI Lab is invite-only. Drop your email and we will review your profile for membership.
            </p>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 md:flex-row">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45"
              />
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? "Submitting..." : "Request Access"}
              </button>
            </form>

            {submitted ? (
              <p className="mt-4 rounded-xl border border-[rgba(25,245,169,0.4)] bg-[rgba(25,245,169,0.1)] px-4 py-3 font-body text-sm text-white">
                Request received. We will review your profile and follow up with access details.
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
