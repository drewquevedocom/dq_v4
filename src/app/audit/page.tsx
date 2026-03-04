"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";

export default function AuditPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <Header />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-32 pt-32 md:pt-40">
        <Link href="/#home" className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white">
          <ArrowLeft size={14} /> Back
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-yellow-500" />
            <span className="font-tech text-xs uppercase tracking-widest text-yellow-500/80">Diagnostic Systems</span>
          </div>
          <h1 className="font-display text-[8vw] uppercase leading-none tracking-[-0.01em] text-white md:text-[5vw]">
            Systems Audit
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-[var(--fg-2)]">
            Identify friction, evaluate readiness, and map out your transition to an AI-augmented infrastructure.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
