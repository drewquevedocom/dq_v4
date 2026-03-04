"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import CapabilitiesGrid from "@/components/ui/Capabilities";

export default function CapabilitiesPage() {
    return (
        <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
            <NoiseLayer />
            <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
            <Header />

            <section className="relative z-10 px-4 pb-24 pt-28 md:px-8 md:pt-36">
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/#home"
                        className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
                    >
                        <ArrowLeft size={14} />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 md:mb-16"
                    >
                        <span className="neo-chip">Operator Arsenal</span>
                        <h1 className="mt-5 font-display text-[14vw] uppercase leading-[0.86] tracking-[-0.01em] text-white md:text-[7vw]">
                            Capabilities
                        </h1>
                        <p className="mt-4 max-w-2xl text-balance font-body text-base leading-relaxed text-[var(--fg-2)]">
                            The complete stack behind the AgentIQAgents ecosystem. Combining high-fidelity engineering, autonomous LLM agents, and GEO-first distribution.
                        </p>
                    </motion.div>

                    <div className="mx-auto mt-16 max-w-6xl">
                        {/* Reusing the Capabilities grid without the section padding wrapper since we are in a page */}
                        <CapabilitiesGrid />
                    </div>
                </div>
            </section>
        </div>
    );
}
