"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <Header />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-40 md:px-8 md:pt-52">
        <Link href="/#home" className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-[var(--accent-cyan)]" />
            <span className="font-tech text-xs uppercase tracking-widest text-[#D1C4E9]">AgentIQ Control</span>
          </div>
          <h1 className="font-display text-[8vw] uppercase leading-none tracking-[-0.01em] text-white md:text-[5vw]">
            Dashboard
          </h1>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-48 rounded-2xl border border-white/5 bg-white/5" />
          ))}
        </div>
      </main>
    </div>
  );
}
