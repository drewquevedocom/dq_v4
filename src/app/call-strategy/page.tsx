"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { trackEvent } from "@/lib/analytics";

type Answers = {
  urgency: string;
  budget: string;
  team: string;
  volume: string;
  readiness: string;
  authority: string;
};

const scoreMap: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

const initialAnswers: Answers = {
  urgency: "",
  budget: "",
  team: "",
  volume: "",
  readiness: "",
  authority: "",
};

export default function CallStrategyPage() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => {
    return Object.values(answers).reduce((total, value) => total + (scoreMap[value] ?? 0), 0);
  }, [answers]);

  const qualification = useMemo(() => {
    if (score >= 14) return "Highly Qualified";
    if (score >= 9) return "Potential Fit";
    return "Needs Preparation";
  }, [score]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "call_strategy_questionnaire",
          qualification,
          score,
          answers,
        }),
      });
      setSubmitted(true);
      trackEvent("call_strategy_submitted", { qualification, score });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />
      <section className="relative z-10 px-4 pb-24 pt-36 md:px-8 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <div className="neo-card p-6 md:p-10">
            <div className="inline-flex neo-chip">Call Strategy Qualification</div>
            <h1 className="mt-4 text-4xl uppercase tracking-tight md:text-6xl">
              Qualification Questionnaire
            </h1>
            <p className="mt-3 max-w-3xl font-body text-sm leading-relaxed text-[var(--fg-1)] md:text-base">
              Answer these six questions so Jarvis can route you into the right strategy lane.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 font-body text-sm outline-none focus:border-white/45"
                />
              </div>

              {[
                ["urgency", "How urgent is your growth target?"],
                ["budget", "How ready is your budget for implementation?"],
                ["team", "How strong is your internal execution team?"],
                ["volume", "How much monthly lead volume do you need?"],
                ["readiness", "How ready are your assets (site/content/CRM)?"],
                ["authority", "Are you the decision maker?"],
              ].map(([key, label]) => (
                <div key={key} className="rounded-xl border border-white/15 bg-black/25 p-4">
                  <p className="mb-3 font-body text-sm font-semibold text-white">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["high", "High"],
                      ["medium", "Medium"],
                      ["low", "Low"],
                      ["none", "Not Yet"],
                    ].map(([value, text]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [key]: value } as Answers))}
                        className={`rounded-full border px-3 py-1.5 font-tech text-[0.58rem] uppercase tracking-widest ${
                          answers[key as keyof Answers] === value
                            ? "border-[rgba(168,85,247,0.7)] bg-[rgba(122,67,230,0.24)] text-white"
                            : "border-white/20 bg-black/30 text-white/80"
                        }`}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-white/20 bg-black/35 p-4">
                <p className="font-tech text-[0.62rem] uppercase tracking-widest text-[var(--fg-2)]">
                  Current Score
                </p>
                <p className="mt-1 font-display text-3xl tracking-tight">{score}/18</p>
                <p className="font-body text-sm text-white/80">{qualification}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? "Submitting..." : "Submit For Review"}
                </button>
                <Link href="/book-strategy" className="btn-secondary">
                  Book Strategy Instead
                </Link>
                <Link href="/#home" className="btn-secondary">
                  Back To Home
                </Link>
              </div>

              {submitted ? (
                <p className="rounded-xl border border-[rgba(168,85,247,0.45)] bg-[rgba(122,67,230,0.2)] px-4 py-3 font-body text-sm text-white">
                  Received. Jarvis queued your intake and will prioritize your strategy path.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
