"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

export default function AuditPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    setLoading(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "audit_request" }),
      });
      setSubmitted(true);
      trackEvent("audit_request_submitted");
      event.currentTarget.reset();
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
          >
            <span className="neo-chip">GEO Audit</span>
            <h1 className="mt-5 font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.01em] md:text-[5vw]">
              Request Audit
            </h1>
            <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-[var(--fg-1)]">
              Get a comprehensive analysis of your brand visibility across AI search engines, traditional SEO, and citation authority signals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="neo-card mt-10 p-6 md:p-10"
          >
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <input name="name" required placeholder="Full name" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45" />
              <input name="email" required type="email" placeholder="Work email" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45" />
              <input name="website" required type="url" placeholder="Website URL (https://...)" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45" />
              <input name="industry" placeholder="Industry / Niche" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45" />
              <textarea
                name="goals"
                required
                placeholder="What are your primary growth goals?"
                className="min-h-[120px] rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45 md:col-span-2"
              />
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? "Submitting..." : "Request Audit"}
                </button>
                <Link href="/research" className="btn-secondary">
                  Back to Research
                </Link>
              </div>
            </form>

            {submitted ? (
              <p className="mt-4 rounded-xl border border-[rgba(25,245,169,0.4)] bg-[rgba(25,245,169,0.1)] px-4 py-3 font-body text-sm text-white">
                Audit request received. We will analyze your site and send findings within 48 hours.
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
