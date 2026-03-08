"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Fun Facts (randomly picked each loop)
   ───────────────────────────────────────────── */
const FUN_FACTS = [
  "Did you know? Your driver built a website for the Vatican & Pope John Paul II in 2001 — commissioned by a Vatican attorney.",
  "Did you know? Your driver built AI systems that automate 60+ hours of work per month for medical companies.",
  "Did you know? Your driver produced a 4K music video in 1.5 hours using AI — at 5% of traditional cost.",
  "Did you know? Your driver helped a construction company rank #1 in AI search results.",
  "Did you know? Your driver is a family man who builds AI systems by day and drives you safely by night.",
  "Did you know? Your driver builds autonomous AI agent swarms that run entire businesses.",
  "Did you know? Your driver has been building websites since 1999 — before Google was even a year old.",
  "Did you know? Your driver’s AI agents answer phone calls, book appointments, and close deals 24/7.",
];

/* ─────────────────────────────────────────────
   House Rules
   ───────────────────────────────────────────── */
const HOUSE_RULES = [
  { icon: "🚭", rule: "No Smoking — Unless You Brought Enough for Everyone" },
  { icon: "🍔", rule: "No Eating — This Isn't a Food Truck (Drinks OK)" },
  { icon: "🔊", rule: "Volume Down — My Ears Have Feelings Too" },
  { icon: "🙏", rule: "Treat the Ride Like Your Mom's Car" },
];

/* ─────────────────────────────────────────────
   Jokes — general audience, actually funny
   ───────────────────────────────────────────── */
const JOKES = [
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "I’m on a seafood diet.", punchline: "I see food and I eat it." },
  { setup: "My therapist says I have a preoccupation with vengeance.", punchline: "We’ll see about that." },
  { setup: "I used to hate facial hair...", punchline: "but then it grew on me." },
  { setup: "I asked the gym instructor to teach me the splits. He said ‘How flexible are you?’", punchline: "I said ‘I can’t make Tuesdays.’" },
  { setup: "My wife told me to stop impersonating a flamingo.", punchline: "I had to put my foot down." },
  { setup: "I told my suitcase we’re not going on vacation.", punchline: "Now I’m dealing with emotional baggage." },
  { setup: "What do you call a fake noodle?", punchline: "An impasta." },
  { setup: "I have a fear of speed bumps.", punchline: "But I’m slowly getting over it." },
  { setup: "My doctor told me I’m going deaf.", punchline: "The news was hard for me to hear." },
];

/* ─────────────────────────────────────────────
   Slide definitions
   ───────────────────────────────────────────── */
type SlideType =
  | "welcome"
  | "brand"
  | "services"
  | "funfact"
  | "casestudy"
  | "creative"
  | "video"
  | "houserules"
  | "joke"
  | "connect"
  | "tips"
  | "rate";

interface Slide {
  id: string;
  type: SlideType;
  accent: string;
  duration?: number; // custom duration in ms (default 10000)
}

const SLIDES: Slide[] = [
  { id: "welcome", type: "welcome", accent: "rgba(122, 67, 230, 0.18)" },
  { id: "brand", type: "brand", accent: "rgba(168, 85, 247, 0.14)" },
  { id: "services", type: "services", accent: "rgba(0, 212, 255, 0.12)" },
  { id: "funfact", type: "funfact", accent: "rgba(253, 184, 19, 0.14)" },
  { id: "econstruct", type: "casestudy", accent: "rgba(0, 212, 255, 0.14)" },
  { id: "laso", type: "casestudy", accent: "rgba(25, 245, 169, 0.12)" },
  { id: "creative", type: "creative", accent: "rgba(168, 85, 247, 0.16)" },
  { id: "houserules", type: "houserules", accent: "rgba(253, 184, 19, 0.14)", duration: 12000 },
  { id: "video", type: "video", accent: "rgba(122, 67, 230, 0.10)", duration: 30000 },
  { id: "joke", type: "joke", accent: "rgba(253, 184, 19, 0.12)" },
  { id: "connect", type: "connect", accent: "rgba(122, 67, 230, 0.14)" },
  { id: "tips", type: "tips", accent: "rgba(25, 245, 169, 0.14)" },
  { id: "rate", type: "rate", accent: "rgba(253, 184, 19, 0.16)" },
];

const DEFAULT_DURATION = 10000;

/* ─── Helpers ─── */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration: number = 1500, delay: number = 400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ─── Background with image ─── */
function SlideBg({ src, gradient = "linear-gradient(to top, var(--bg-0) 0%, rgba(5,6,10,0.7) 50%, rgba(5,6,10,0.3) 100%)" }: { src?: string; gradient?: string }) {
  if (!src) return null;
  return (
    <>
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <Image src={src} alt="Background" fill className="object-cover opacity-[0.4]" priority />
      </div>
      <div className="absolute inset-0 z-[-1]" style={{ background: gradient }} />
    </>
  );
}

/* ─── Transition variants ─── */
const slideVariants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

const stagger = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

/* ─── Typewriter component ─── */
function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-[var(--accent-magenta)]">|</span>
    </span>
  );
}

/* ─── Gradient sweep text ─── */
function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        background: "linear-gradient(90deg, #7a43e6, #bb8dff, #00D4FF, #7a43e6)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradientSweep 3s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Wave text (letter by letter) ─── */
function WaveText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3 + i * 0.04,
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Counter stat ─── */
function CountStat({ value, prefix, suffix, label, delay }: { value: number; prefix?: string; suffix?: string; label: string; delay: number }) {
  const count = useCountUp(value, 1200, delay);
  return (
    <div className="neo-card px-4 py-3">
      <div className="font-tech text-3xl font-bold text-[var(--accent-cyan)]">
        {prefix}{count}{suffix}
      </div>
      <div className="mt-1 font-body text-sm uppercase tracking-wide text-[var(--fg-2)]">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SLIDE RENDERERS — 1080p Toyota Sienna display
   ═══════════════════════════════════════════════ */

function WelcomeSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src="/assets/drew_driver_sienna.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <Image src="/assets/web_logo.png" alt="Drew Quevedo" width={400} height={100} className="mx-auto" priority />
      </motion.div>
      <motion.h1
        custom={1}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9] tracking-tight"
      >
        Welcome
        <br />
        <GradientText className="font-display text-6xl lg:text-8xl uppercase leading-[0.9]">Uber / Lyft Riders</GradientText>
      </motion.h1>
      <motion.p
        custom={2}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full font-body text-xl lg:text-3xl text-[var(--fg-1)]"
      >
        Sit back, relax, and enjoy the ride.
      </motion.p>
    </div>
  );
}

function BrandSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src="/assets/drew_LAB_COAT_2.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="shrink-0">
        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl border-4 border-[var(--line)]">
          <Image src="/assets/portfolio/drew_tux.png" alt="Drew Quevedo" fill className="object-cover" />
        </div>
      </motion.div>
      <motion.div custom={1} variants={stagger} initial="hidden" animate="show">
        <Image src="/assets/web_logo.png" alt="Drew Quevedo" width={300} height={75} className="mx-auto" />
      </motion.div>
      <motion.p custom={2} variants={stagger} initial="hidden" animate="show" className="w-full font-tech text-base lg:text-xl uppercase tracking-[0.16em] text-[var(--accent-magenta)]">
        AI Strategist &middot; Engineer &middot; Creator &middot; Family Man
      </motion.p>
      <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full max-w-4xl font-body text-xl lg:text-3xl leading-relaxed text-[var(--fg-2)] mx-auto">
        Building high-performance autonomous brand ecosystems powered by Agentic AI, GEO strategy, and cinematic design.
      </motion.p>
    </div>
  );
}

function ServicesSlide() {
  const pillars = [
    { icon: "🎯", label: "GEO Strategy", desc: "Search Optimization" },
    { icon: "🤖", label: "Agentic AI", desc: "Autonomous Agents" },
    { icon: "⚙️", label: "Engineering", desc: "Full-Stack Apps" },
    { icon: "🎨", label: "Creative", desc: "AI Content" },
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <SlideBg src="/assets/drew_uber_driver.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">What I Do</span>
      </motion.div>
      <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]">
        <GradientText>I Build the Future</GradientText>
      </motion.h2>
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 mx-auto">
        {pillars.map((p, i) => (
          <motion.div
            key={p.label}
            custom={i + 2}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="neo-card flex flex-col items-center gap-3 p-6"
          >
            <span className="text-5xl lg:text-6xl">{p.icon}</span>
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-[var(--fg-0)]">{p.label}</span>
            <span className="font-body text-base lg:text-xl text-[var(--fg-2)]">{p.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FunFactSlide({ fact }: { fact: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <SlideBg src="/assets/drew_LAB_COAT_2.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="text-6xl lg:text-8xl">
        🧐
      </motion.div>
      <motion.div custom={1} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip border-[rgba(253,184,19,0.5)] text-[#FDB813] text-lg lg:text-xl px-6 py-2">Fun Fact</span>
      </motion.div>
      <div className="w-full max-w-4xl mx-auto font-body text-3xl lg:text-5xl leading-[1.4] neo-card p-8">
        <Typewriter text={fact} />
      </div>
    </div>
  );
}

function CaseStudySlide({ id }: { id: string }) {
  const studies: Record<string, {
    name: string;
    logo: string;
    logoBg?: string;
    bg?: string;
    metrics: { value: number; prefix?: string; suffix?: string; label: string }[];
    tagline: string;
  }> = {
    econstruct: {
      name: "eConstruct Inc",
      logo: "/assets/New-House-Construction-Contractor-ADUs-Builder-Tiny-Homes-in-Los-Angeles-03-01-2026_09_53_PM.png",
      logoBg: "bg-white/10",
      bg: "/assets/drew_super_laker_dad.png",
      metrics: [
        { value: 4.2, suffix: "x", label: "GEO Citations", prefix: "" },
        { value: 310, suffix: "%", label: "Organic Traffic", prefix: "+" },
        { value: 1, suffix: "", label: "AI Search Rank", prefix: "#" },
        { value: 3, suffix: "x", label: "Lead Pipeline", prefix: "" },
      ],
      tagline: "GEO-first strategy for restaurant construction in LA",
    },
    laso: {
      name: "Laso Imaging",
      logo: "/assets/portfolio/laso.png",
      metrics: [
        { value: 7, suffix: "", label: "AI Agent Swarm", prefix: "" },
        { value: 85, suffix: "%", label: "Faster Response", prefix: "-" },
        { value: 60, suffix: "hrs", label: "Monthly Saved", prefix: "" },
        { value: 99, suffix: "%", label: "Uptime", prefix: "" },
      ],
      tagline: "7-Agent AI Swarm · CEO Dashboard · Shopify Cart",
    },
  };
  const study = studies[id];
  if (!study) return null;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src={study.bg || "/assets/portfolio/geo_is_ner_seo_image.jpg"} />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">Case Study</span>
      </motion.div>
      <motion.div custom={1} variants={stagger} initial="hidden" animate="show" className={`relative h-32 w-72 ${study.logoBg || ""} rounded-xl p-2`}>
        <Image src={study.logo} alt={study.name} fill className="object-contain p-2" />
      </motion.div>
      <motion.h2 custom={2} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]">
        {study.name}
      </motion.h2>
      <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full font-tech text-base lg:text-xl uppercase tracking-[0.12em] text-[var(--accent-green)]">
        {study.tagline}
      </motion.p>
      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 mx-auto">
        {study.metrics.map((m, i) => (
          <CountStat
            key={m.label}
            value={m.value}
            prefix={m.prefix}
            suffix={m.suffix}
            label={m.label}
            delay={600 + i * 200}
          />
        ))}
      </div>
    </div>
  );
}

function CreativeSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src="/assets/portfolio/geo_is_ner_seo_image.jpg" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip border-[rgba(168,85,247,0.5)] text-[var(--accent-magenta)] text-lg lg:text-xl px-6 py-2">Creative AI</span>
      </motion.div>
      <motion.div custom={1} variants={stagger} initial="hidden" animate="show" className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border-2 border-[var(--line)]" style={{ aspectRatio: "16/9" }}>
        <Image src="/assets/portfolio/geo_is_ner_seo_image.jpg" alt="GEO Music Video" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 text-left">
          <div className="font-display text-3xl lg:text-5xl uppercase tracking-wide">GEO is the New SEO</div>
          <div className="font-tech text-xl text-[var(--fg-2)]">4K Cinematic AI Music Video</div>
        </div>
      </motion.div>
      <motion.h2 custom={2} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-4xl lg:text-6xl uppercase leading-[0.9]">
        Produced in <span className="text-[var(--accent-magenta)]">1.5 Hours</span> with AI
      </motion.h2>
      <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full font-body text-2xl lg:text-3xl text-[var(--fg-2)]">
        At 5% of traditional cost using OpenArt.ai, Suno, ChatGPT &amp; Whisk
      </motion.p>
    </div>
  );
}

function VideoSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-12 text-center w-full">
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-2xl lg:text-4xl uppercase tracking-wide text-[var(--fg-1)]">
        Now Playing &mdash; GEO is the New SEO
      </motion.div>
      <motion.div
        custom={1}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl border-2 border-[var(--line)]"
        style={{ aspectRatio: "16/9" }}
      >
        <iframe
          src="https://www.youtube.com/embed/swv_QE6E5X4?autoplay=1&mute=1&loop=1&playlist=swv_QE6E5X4&controls=0&modestbranding=1&rel=0&showinfo=0"
          title="GEO is the New SEO"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </motion.div>
      <motion.p custom={2} variants={stagger} initial="hidden" animate="show" className="font-tech text-base lg:text-xl uppercase tracking-[0.15em] text-[var(--fg-2)]">
        drewquevedo.com
      </motion.p>
    </div>
  );
}

function HouseRulesSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src="/assets/drew_uber_driver.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip border-[rgba(253,184,19,0.5)] text-[#FDB813] text-lg lg:text-xl px-6 py-2">Rider Vibes</span>
      </motion.div>
      <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]">
        <span className="gradient-text">House Rules</span>
      </motion.h2>
      <div className="flex w-full max-w-lg mx-auto flex-col gap-4 mt-4">
        {HOUSE_RULES.map((r, i) => (
          <motion.div
            key={i}
            custom={i + 2}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="neo-card flex items-center gap-6 px-8 py-4 text-left"
          >
            <span className="text-4xl lg:text-5xl shrink-0">{r.icon}</span>
            <span className="font-body text-2xl lg:text-3xl text-[var(--fg-1)] leading-tight">{r.rule}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function JokeSlide({ joke }: { joke: { setup: string; punchline: string } }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <SlideBg src="/assets/drew_driver_sienna.png" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-6xl lg:text-8xl"
      >
        😂
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-5xl mx-auto neo-card font-display text-4xl lg:text-6xl p-8 leading-[1.2] tracking-tight"
      >
        {joke.setup}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.5, type: "spring", stiffness: 200 }}
        className="w-full font-display text-5xl lg:text-7xl leading-[1.1] text-[#FDB813]"
        style={{ textShadow: "0 0 30px rgba(253, 184, 19, 0.4)" }}
      >
        {joke.punchline}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.5 }}
        className="w-full font-tech text-base lg:text-xl uppercase tracking-[0.18em] text-[var(--fg-2)] mt-4"
      >
        Your driver is also a comedian (apparently)
      </motion.div>
    </div>
  );
}

function ConnectSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src="/assets/drew_LAB_COAT_2.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">Connect</span>
      </motion.div>
      <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]">
        <GradientText>Let&apos;s Build Something</GradientText>
      </motion.h2>
      <motion.div custom={2} variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center mt-4">
        <div className="relative h-64 w-64 lg:h-80 lg:w-80 overflow-hidden rounded-2xl bg-white p-2">
          <Image src="/assets/QR-Code.png" alt="QR Code" fill className="object-contain p-2" />
        </div>
        <p className="mt-4 font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-2)]">Scan to visit drewquevedo.com</p>
      </motion.div>
      <motion.div custom={3} variants={stagger} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-4 font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-1)] mt-4">
        <span>@drewquevedo</span>
        <span className="text-[var(--line)]">|</span>
        <span>dq@drewquevedo.com</span>
      </motion.div>
      <motion.div custom={4} variants={stagger} initial="hidden" animate="show" className="font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-2)]">
        LinkedIn &middot; Instagram &middot; YouTube
      </motion.div>
    </div>
  );
}

function TipsSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <SlideBg src="/assets/drew_uber_driver.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="text-6xl lg:text-8xl">
        🙏
      </motion.div>
      <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]">
        Tips Are Greatly
        <br />
        <span
          style={{
            background: "linear-gradient(90deg, #FDB813, #FFD700, #FDB813)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmerGold 2s linear infinite",
          }}
        >
          Appreciated
        </span>
      </motion.h2>
      <motion.div custom={1.5} variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center gap-4 mt-4">
        <p className="font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-2)]">Cash App</p>
        <div className="relative h-64 w-64 lg:h-80 lg:w-80 overflow-hidden rounded-2xl border-4 border-[#00D632]">
          <Image src="/assets/Screenshot_20260306_211612_Cash App.jpg" alt="Cash App QR" fill className="object-cover" />
        </div>
        <p className="font-tech text-4xl text-[#00D632] mt-2">$drewq08</p>
      </motion.div>
      <motion.p custom={2} variants={stagger} initial="hidden" animate="show" className="w-full max-w-3xl mx-auto font-body text-2xl lg:text-3xl text-[var(--fg-2)] mt-4">
        Your generosity keeps this ride experience premium. Thank you!
      </motion.p>
    </div>
  );
}

function RateSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <SlideBg src="/assets/drew_fam_beach.png" />
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">Uber / Lyft Riders</span>
      </motion.div>
      <div className="w-full font-display text-6xl lg:text-8xl uppercase leading-[0.9]">
        <WaveText text="Thanks for Riding!" />
      </div>
      <motion.p
        custom={2}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-4xl mx-auto font-body text-2xl lg:text-4xl text-[var(--fg-1)]"
      >
        If you enjoyed the experience, a 5-star rating means the world. Have an amazing day!
      </motion.p>
      <motion.div custom={3} variants={stagger} initial="hidden" animate="show" className="mt-8">
        <Image src="/assets/web_logo.png" alt="Drew Quevedo" width={250} height={60} className="mx-auto opacity-40" />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function AdvertiseDrivePage() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(() => pickRandom(FUN_FACTS));
  const [currentJoke, setCurrentJoke] = useState(() => pickRandom(JOKES));
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance slides
  const advanceSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = (prev + 1) % SLIDES.length;
      if (next === 0) {
        setCurrentFact(pickRandom(FUN_FACTS));
        setCurrentJoke(pickRandom(JOKES));
      }
      if (SLIDES[next]?.type === "funfact") setCurrentFact(pickRandom(FUN_FACTS));
      if (SLIDES[next]?.type === "joke") setCurrentJoke(pickRandom(JOKES));
      return next;
    });
    setProgress(0);
  }, []);

  useEffect(() => {
    const dur = SLIDES[current]?.duration || DEFAULT_DURATION;
    intervalRef.current = setTimeout(advanceSlide, dur);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 50 / dur, 1));
    }, 50);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, advanceSlide]);

  // Wake Lock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const req = async () => {
      try { wakeLock = await navigator.wakeLock.request("screen"); } catch { /* */ }
    };
    req();
    const onVis = () => { if (document.visibilityState === "visible") req(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { wakeLock?.release(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  // Cursor auto-hide
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const hide = () => { document.body.style.cursor = "none"; };
    const show = () => { document.body.style.cursor = "auto"; clearTimeout(t); t = setTimeout(hide, 3000); };
    t = setTimeout(hide, 3000);
    window.addEventListener("mousemove", show);
    return () => { window.removeEventListener("mousemove", show); clearTimeout(t); document.body.style.cursor = "auto"; };
  }, []);

  const slide = SLIDES[current];

  function renderSlide() {
    switch (slide.type) {
      case "welcome": return <WelcomeSlide />;
      case "brand": return <BrandSlide />;
      case "services": return <ServicesSlide />;
      case "funfact": return <FunFactSlide fact={currentFact} />;
      case "casestudy": return <CaseStudySlide id={slide.id} />;
      case "creative": return <CreativeSlide />;
      case "video": return <VideoSlide />;
      case "houserules": return <HouseRulesSlide />;
      case "joke": return <JokeSlide joke={currentJoke} />;
      case "connect": return <ConnectSlide />;
      case "tips": return <TipsSlide />;
      case "rate": return <RateSlide />;
      default: return null;
    }
  }

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[var(--bg-0)] text-white">
      {/* CSS animations */}
      <style jsx global>{`
        @keyframes gradientSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes neonFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.6; }
          94% { opacity: 1; }
          96% { opacity: 0.7; }
          97% { opacity: 1; }
        }
        @keyframes shimmerGold {
          0% { background-position: -200% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-[1] noise-overlay" />
      {/* Neo grid */}
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid opacity-30" />
      {/* Radial accent glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${slide.accent}, transparent)` }}
      />

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 h-full w-full"
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-[4px] bg-white/5">
        <div
          className="h-full transition-none"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))",
            boxShadow: "0 0 12px rgba(122, 67, 230, 0.5)",
          }}
        />
      </div>

      {/* Slide indicator dots */}
      <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-full transition-all duration-300 ${i === current ? "h-2 w-8 bg-[var(--accent-magenta)]" : "h-2 w-2 bg-white/15"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
