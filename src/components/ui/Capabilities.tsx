"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Layers,
  Palette,
  Rocket,
  Terminal,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import SectionSubtitle from "./SectionSubtitle";

const SKILL_CATEGORIES = [
  {
    id: "engineering",
    title: "Engineering",
    description: "Full-stack architecture with production-ready guardrails.",
    icon: <Code2 className="h-6 w-6 text-[var(--accent-cyan)]" />,
    skills: [
      {
        name: "Frontend",
        icon: <Layers className="h-4 w-4" />,
        tech: ["Next.js 14", "React", "TypeScript", "Tailwind"],
      },
      {
        name: "Backend",
        icon: <Terminal className="h-4 w-4" />,
        tech: ["Node.js", "Prisma", "Supabase", "Webhooks", "GitHub"],
      },
      {
        name: "Voice + RAG",
        icon: <Cpu className="h-4 w-4" />,
        tech: ["Telnyx", "Agents", "Pinecone", "LangChain", "ElevenLabs"],
      },
    ],
  },
  {
    id: "ai-agents",
    title: "AI + Agents",
    description: "Autonomous workflows built for conversion and control.",
    icon: <BrainCircuit className="h-6 w-6 text-[var(--accent-green)]" />,
    skills: [
      {
        name: "Orchestration",
        icon: <BrainCircuit className="h-4 w-4" />,
        tech: ["LangGraph", "AutoGen", "OpenAI"],
      },
      {
        name: "Integration",
        icon: <Database className="h-4 w-4" />,
        tech: ["Resend", "Instantly", "Cloudflare", "Google Workspace", "Telnyx"],
      },
    ],
  },
  {
    id: "design",
    title: "Design",
    description: "High-fidelity interfaces that look expensive and convert.",
    icon: <Palette className="h-6 w-6 text-[var(--accent-magenta)]" />,
    skills: [
      {
        name: "Interaction",
        icon: <Palette className="h-4 w-4" />,
        tech: ["GSAP", "Framer Motion", "ScrollTrigger"],
      },
      {
        name: "System",
        icon: <Layers className="h-4 w-4" />,
        tech: ["Tokenized CSS", "Responsive Rhythm", "A11y"],
      },
      {
        name: "AI Design",
        icon: <BrainCircuit className="h-4 w-4" />,
        tech: ["Google Antigravity", "Loveable.dev", "Relicant"],
      },
    ],
  },
  {
    id: "strategy",
    title: "Strategy",
    description: "GEO-first distribution with measurable lead pipelines.",
    icon: <Rocket className="h-6 w-6 text-[var(--accent-cyan)]" />,
    skills: [
      {
        name: "Growth",
        icon: <Rocket className="h-4 w-4" />,
        tech: ["GEO/AEO", "Conversion", "Analytics"],
      },
      {
        name: "Automation",
        icon: <Terminal className="h-4 w-4" />,
        tech: ["n8n", "Apollo", "HITL", "Outbound Sequences"],
      },
    ],
  },
  {
    id: "llm",
    title: "LLM Stack",
    description: "Multi-model reasoning and code generation across the frontier.",
    icon: <BrainCircuit className="h-6 w-6 text-[var(--accent-magenta)]" />,
    skills: [
      {
        name: "Models",
        icon: <BrainCircuit className="h-4 w-4" />,
        tech: ["Perplexity", "Claude Code", "Gemini 3.1", "ChatGPT Codex"],
      },
    ],
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative z-10 w-full snap-start px-4 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "0px" }}
          className="mb-16 text-center md:mb-20"
        >
          <span className="neo-chip">Capabilities Stack</span>
          <br className="hidden md:block" />
          <div className="mt-5">
            <SectionTitle
              title="Operator Arsenal"
              pulseWord="Arsenal"
              titleClassName="text-[clamp(2.6rem,9vw,6rem)]"
              className="flex justify-center flex-col items-center"
            />
          </div>
          <SectionSubtitle
            text="A tight blend of engineering, AI systems, and high-conversion design built to make your brand discoverable and booked."
            keywords={['engineering', 'AI systems', 'high-conversion design', 'discoverable', 'booked']}
            className="mx-auto mt-4 max-w-2xl text-[var(--fg-2)]"
          />
        </motion.div>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-12 scrollbar-hide py-4 px-2">
          {SKILL_CATEGORIES.map((category, index) => (
            <motion.article
              key={category.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              className="neo-card group relative overflow-hidden p-6 md:p-7 min-w-[320px] max-w-[380px] w-[85vw] snap-center flex-shrink-0"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(70,204,255,0.2),transparent_55%)]" />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-2xl border border-[var(--line)] bg-[rgba(10,15,30,0.82)] p-3">
                    {category.icon}
                  </div>
                  <span className="font-tech text-[0.62rem] uppercase tracking-[0.22em] text-[var(--fg-2)]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-display text-3xl uppercase leading-none tracking-wide text-[var(--fg-0)]">
                  {category.title}
                </h3>
                <p className="mt-2 min-h-[52px] font-body text-sm leading-relaxed text-[var(--fg-2)]">
                  {category.description}
                </p>

                <div className="mt-7 space-y-4">
                  {category.skills.map((skill) => (
                    <div key={`${category.id}-${skill.name}`} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[var(--fg-1)]">
                        {skill.icon}
                        <span className="font-body font-semibold">{skill.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {skill.tech.map((tech) => (
                          <span key={`${skill.name}-${tech}`} className="neo-chip">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
