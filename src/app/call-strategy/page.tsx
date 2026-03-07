"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, PhoneForwarded } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";

export default function CallStrategyPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <Header />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-32 pt-40 md:pt-52 text-center">
        <Link href="/book-strategy" className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white">
          <ArrowLeft size={14} /> Back to Scheduling
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 flex justify-center items-center gap-3">
            <PhoneForwarded className="h-5 w-5 text-emerald-400" />
            <span className="font-tech text-xs uppercase tracking-widest text-[#D1C4E9]">Live Bridge</span>
          </div>
          <h1 className="font-display text-[6vw] uppercase leading-none tracking-[-0.01em] text-white md:text-[4vw]">
            Call Initialization
          </h1>
          <p className="mt-6 font-body text-lg leading-relaxed text-[var(--fg-2)]">
            Your discovery bridge is active. If you are experiencing technical difficulties, please utilize the alternative contact form.
          </p>

          <button className="mt-10 neo-btn">Initiate Connection Protocol</button>
        </motion.div>
      </main>
    </div>
  );
}
