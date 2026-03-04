"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CalendarSync } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";

export default function BookStrategyPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <Header />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-32 pt-32 md:pt-40 text-center">
        <Link href="/#home" className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white">
          <ArrowLeft size={14} /> Back
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 flex justify-center items-center gap-3">
            <CalendarSync className="h-5 w-5 text-[var(--accent-magenta)]" />
            <span className="font-tech text-xs uppercase tracking-widest text-[#D1C4E9]">Direct Access</span>
          </div>
          <h1 className="font-display text-[6vw] uppercase leading-none tracking-[-0.01em] text-white md:text-[4vw]">
            Book a Strategy
          </h1>
          <p className="mt-6 font-body text-lg leading-relaxed text-[var(--fg-2)]">
            Secure a 1-on-1 session to blueprint your transition from standard operations to autonomous growth.
          </p>
          <div className="mt-12 mx-auto max-w-md h-[500px] border border-white/10 rounded-2xl bg-white/5 flex items-center justify-center font-tech text-xs text-white/50">
            [ Cal.com / Scheduling Widget Integration pending ]
          </div>
        </motion.div>
      </main>
    </div>
  );
}
