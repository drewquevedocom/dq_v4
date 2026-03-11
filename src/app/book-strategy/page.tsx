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

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-32 pt-40 md:pt-52 text-center">
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
          <div className="mt-12 mx-auto w-full max-w-5xl h-[850px]" style={{ colorScheme: "dark" }}>
            <iframe 
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0E6ol4V54QwhDV-8RdF-bm4oJWdcx4VArEhJA03iLu15OqYTXm8XPtfPTHb4dEilQxDgsUYf4g?gv=true" 
              style={{ border: 0, backgroundColor: "transparent" }} 
              width="100%" 
              height="100%" 
              frameBorder="0"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
