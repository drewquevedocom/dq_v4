"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          source: "contact_page_form",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        trackEvent("contact_form_submit", { source: "contact_page" });
        form.reset();
      } else {
        console.error("Failed to submit lead");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <Header />

      <section className="px-4 pb-24 pt-36 md:px-8 md:pt-40">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="neo-card p-6 md:p-8">
            <div className="inline-flex neo-chip">Contact Form</div>
            <h1 className="mt-4 text-5xl uppercase tracking-tight md:text-6xl">
              Let&apos;s Talk
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-[var(--fg-1)] md:text-base">
              Send your message and I will respond with next steps. For scheduling, use the Book Strategy questionnaire.
            </p>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <input name="name" required placeholder="Full name" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <input name="email" required type="email" placeholder="Work email" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <input name="company" placeholder="Company" className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45" />
              <textarea
                name="message"
                required
                placeholder="How can we help?"
                className="min-h-[140px] rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none focus:border-white/45"
              />
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? "Sending..." : "Send Message"}
                </button>
                <Link href="/book-strategy" className="btn-secondary">
                  Book Strategy
                </Link>
              </div>
              {submitted ? (
                <p className="rounded-xl border border-[rgba(168,85,247,0.45)] bg-[rgba(122,67,230,0.2)] px-4 py-3 text-sm text-white">
                  Message received. We&apos;ll get back to you shortly.
                </p>
              ) : null}
            </form>
          </div>

          <div className="neo-card p-6 md:p-8">
            <div className="inline-flex neo-chip">Company Information</div>
            <h2 className="mt-4 text-4xl uppercase tracking-tight md:text-5xl">Drew Quevedo</h2>
            <div className="mt-5 space-y-3 font-body text-sm text-white/85 md:text-base">
              <p>
                <span className="font-tech uppercase tracking-widest text-white/70">Email</span>
                <br />
                dq@drewquevedo.com
              </p>
              <p>
                <span className="font-tech uppercase tracking-widest text-white/70">Phone</span>
                <br />
                +1 (818) 213-1225
              </p>
              <p>
                <span className="font-tech uppercase tracking-widest text-white/70">Hours</span>
                <br />
                Monday to Friday, 10:00 AM - 4:00 PM PST
              </p>
              <p>
                <span className="font-tech uppercase tracking-widest text-white/70">Location</span>
                <br />
                Remote Operations, United States
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/#home" className="btn-secondary">
                Home
              </Link>
              <Link href="/portfolio" className="btn-secondary">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
