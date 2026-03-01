"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

const QUESTIONS = [
  { key: "website", label: "Do you have a live website with original content?" },
  { key: "seo", label: "Are you currently investing in SEO or content marketing?" },
  { key: "crm", label: "Do you have a CRM or lead tracking system in place?" },
  { key: "budget", label: "Do you have budget allocated for AI/automation tooling?" },
  { key: "authority", label: "Does your brand have published thought leadership or PR?" },
  { key: "data", label: "Do you have access to customer data or analytics?" },
  { key: "team", label: "Do you have internal capacity for implementation support?" },
  { key: "timeline", label: "Are you ready to begin within 30 days?" },
];

export default function ReadinessPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => {
    return Object.values(answers).filter((v) => v === "yes").length;
  }, [answers]);

  const level = useMemo(() => {
    if (score >= 7) return { label: "Launch Ready", color: "var(--accent-green)" };
    if (score >= 4) return { label: "Near Ready", color: "var(--accent-cyan)" };
    return { label: "Foundation Phase", color: "var(--accent-magenta)" };
  }, [score]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "readiness_scan", score, answers }),
      });
      setSubmitted(true);
      trackEvent("readiness_scan_submitted", { score });
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
          >
            <span className="neo-chip">Diagnostic</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[5vw]">
              Readiness Scan
            </h1>
            <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-[var(--fg-1)]">
              Answer 8 quick questions to assess your AI and GEO readiness. See where you stand before committing to a strategy engagement.
            </p>
          </motion.div>

          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            {QUESTIONS.map((q, i) => (
              <motion.div
                key={q.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="neo-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
              >
                <p className="font-body text-sm text-[var(--fg-1)]">{q.label}</p>
                <div className="flex gap-2">
                  {["yes", "no"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: value }))}
                      className={`rounded-full border px-4 py-1.5 font-tech text-[0.58rem] uppercase tracking-widest transition ${
                        answers[q.key] === value
                          ? "border-[rgba(168,85,247,0.7)] bg-[rgba(122,67,230,0.24)] text-white"
                          : "border-white/20 bg-black/30 text-white/70 hover:text-white"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="neo-card p-5">
              <p className="font-tech text-[0.62rem] uppercase tracking-widest text-[var(--fg-2)]">
                Readiness Score
              </p>
              <p className="mt-1 font-display text-4xl tracking-tight" style={{ color: level.color }}>
                {score}/{QUESTIONS.length}
              </p>
              <p className="font-body text-sm" style={{ color: level.color }}>
                {level.label}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for results"
                className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45"
              />
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? "Submitting..." : "Submit Readiness Scan"}
              </button>
            </div>

            {submitted ? (
              <p className="rounded-xl border border-[rgba(25,245,169,0.4)] bg-[rgba(25,245,169,0.1)] px-4 py-3 font-body text-sm text-white">
                Scan results saved. We will follow up with a personalized readiness report.
              </p>
            ) : null}
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
            <Link href="/book-strategy" className="btn-secondary">
              Book Strategy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
