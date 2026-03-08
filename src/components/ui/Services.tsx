"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Briefcase, Zap, Network } from "lucide-react";
import SectionTitle from "./SectionTitle";
import SectionSubtitle from "./SectionSubtitle";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const SERVICES = [
    {
        id: "coaching",
        title: "AI Agency Coaching",
        description: "Start a fully automated AI marketing agency. Comprehensive business coaching to build, automate, and scale your own operations.",
        icon: <Briefcase className="h-6 w-6 text-[var(--accent-cyan)]" />,
        features: ["Agency Blueprint", "Client Acquisition", "Process Automation"],
        link: "/call-strategy"
    },
    {
        id: "vibe-coding",
        title: "Vibe Coding Service",
        description: "We build AI smart websites and apps at lightning speed using Vibe Coding. Premium design meets intelligent backend engineering.",
        icon: <Zap className="h-6 w-6 text-[var(--accent-magenta)]" />,
        features: ["Smart Websites", "App Development", "Rapid Prototyping"],
        link: "/book-strategy"
    },
    {
        id: "agent-swarm",
        title: "7 Agent Swarm System",
        description: "Our signature 7 Agent Swarm Small Business System. A networked hive of AI employees handling your entire workflow.",
        icon: <Network className="h-6 w-6 text-[var(--accent-green)]" />,
        features: ["24/7 Operations", "Multi-Agent Workflows", "Business Scaling"],
        link: "/book-strategy"
    }
];

export default function Services() {
    return (
        <section
            id="services"
            className="relative z-10 w-full px-4 py-24 md:px-8 md:py-28 bg-black/40 border-y border-white/5"
        >
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "0px" }}
                    className="mb-16 text-center md:mb-20"
                >
                    <span className="neo-chip">Services & Consultation</span>
                    <br className="hidden md:block" />
                    <div className="mt-5">
                        <SectionTitle
                            title="Scale With AI"
                            pulseWord="Scale"
                            titleClassName="text-[clamp(2.6rem,9vw,6rem)]"
                            className="flex justify-center flex-col items-center"
                        />
                    </div>
                    <SectionSubtitle
                        text="From coaching you to build an automated agency, to deploying our 7 Agent Swarm for your small business."
                        keywords={['coaching', 'automated', '7 Agent Swarm']}
                        className="mx-auto mt-4 max-w-2xl text-[var(--fg-2)]"
                    />
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {SERVICES.map((service, index) => (
                        <motion.article
                            key={service.id}
                            initial={{ opacity: 0, y: 36 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-8% 0px" }}
                            className="neo-card group relative overflow-hidden p-8 flex flex-col h-full"
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_55%)]" />
                            </div>

                            <div className="relative z-10 flex h-full flex-col">
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="rounded-2xl border border-[var(--line)] bg-[rgba(10,15,30,0.82)] p-3">
                                        {service.icon}
                                    </div>
                                </div>

                                <h3 className="font-display text-2xl uppercase leading-none tracking-wide text-[var(--fg-0)] mb-4">
                                    {service.title}
                                </h3>
                                <p className="font-body text-sm leading-relaxed text-[var(--fg-2)] mb-6 flex-grow">
                                    {service.description}
                                </p>

                                <div className="space-y-2 mb-8">
                                    {service.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-[var(--fg-1)]">
                                            <BrainCircuit className="h-3 w-3 text-[var(--fg-3)]" />
                                            <span className="font-tech uppercase tracking-wider">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={service.link}
                                    className="btn-primary w-full text-center"
                                    onClick={() => trackEvent("service_cta_click", { service: service.id })}
                                >
                                    Explore Service
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
