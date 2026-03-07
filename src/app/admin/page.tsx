"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";

export default function AdminPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <Header />

      <main className="relative z-10 mx-auto max-w-lg px-4 pb-32 pt-40 md:pt-52 text-center">
        <Link href="/#home" className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white">
          <ArrowLeft size={14} /> Back
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-2xl border border-white/10 bg-black/40 p-12 backdrop-blur-md">
          <Lock className="mx-auto mb-6 h-8 w-8 text-red-500/80" />
          <h1 className="font-tech text-sm uppercase tracking-widest text-[#D1C4E9] mb-4">Secured Area</h1>
          <p className="font-body text-[var(--fg-2)] mb-8">Access restricted to authenticated AgentIQ personnel.</p>
          <button className="neo-btn w-full justify-center">Authenticate</button>
        </motion.div>
      </main>
    </div>
  );
}
