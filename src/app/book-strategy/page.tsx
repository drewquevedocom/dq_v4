"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { trackEvent } from "@/lib/analytics";

export default function BookStrategyPage() {
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
        body: JSON.stringify({
          ...payload,
          source: "small_business_strategy_questionnaire",
        }),
      });
      setSubmitted(true);
      trackEvent("book_strategy_submitted", { source: "small_business_questionnaire" });
      event.currentTarget.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <Header />
      <section className="px-4 pb-24 pt-36 md:px-8 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <div className="neo-card p-6 md:p-10">
            <div className="inline-flex neo-chip">Book Strategy</div>
            <h1 className="mt-4 text-4xl uppercase tracking-tight md:text-6xl">
              Small Business Questionnaire
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-[var(--fg-1)] md:text-base">
              Tell us about your business, goals, and current bottlenecks so we can prepare a high-value strategy session.
            </p>

            <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <input name="name" required placeholder="Owner / contact name" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <input name="email" required type="email" placeholder="Business email" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <input name="business_name" required placeholder="Business name" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <input name="industry" required placeholder="Industry / niche" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <select name="business_stage" required className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45">
                <option value="">Business stage</option>
                <option>Just launched</option>
                <option>Operating under 2 years</option>
                <option>Established 2+ years</option>
              </select>
              <select name="team_size" required className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45">
                <option value="">Team size</option>
                <option>Solo</option>
                <option>2-5 people</option>
                <option>6-20 people</option>
                <option>21+ people</option>
              </select>
              <select name="monthly_revenue_range" required className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45">
                <option value="">Monthly revenue range</option>
                <option>Pre-revenue</option>
                <option>Under $10k</option>
                <option>$10k-$50k</option>
                <option>$50k-$200k</option>
                <option>$200k+</option>
              </select>
              <select name="timeline" required className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45">
                <option value="">Desired timeline</option>
                <option>ASAP</option>
                <option>Within 30 days</option>
                <option>30-90 days</option>
                <option>Exploring options</option>
              </select>
              <textarea
                name="primary_goal"
                required
                placeholder="Primary goal for the next 90 days"
                className="min-h-[110px] rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45 md:col-span-2"
              />
              <textarea
                name="biggest_blocker"
                required
                placeholder="Biggest blocker right now"
                className="min-h-[110px] rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45 md:col-span-2"
              />

              <div className="mt-2 flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? "Submitting..." : "Submit Questionnaire"}
                </button>
                <Link href="/contact" className="btn-secondary">
                  Contact Page
                </Link>
              </div>
            </form>

            {submitted ? (
              <p className="mt-4 rounded-xl border border-[rgba(168,85,247,0.45)] bg-[rgba(122,67,230,0.2)] px-4 py-3 font-body text-sm text-white">
                Questionnaire submitted. We&apos;ll review and send booking options.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
