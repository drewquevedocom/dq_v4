"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────
   Fun Facts (randomly picked each cycle)
   ───────────────────────────────────────────── */
const FUN_FACTS = [
  "Did you know? Your driver built a website for the Vatican & Pope John Paul II in 2001 — commissioned by a Vatican attorney.",
  "Did you know? Your driver built AI systems that automate 60+ hours of work per month for medical companies.",
  "Did you know? Your driver produced a 4K music video in 1.5 hours using AI — at 5% of traditional cost.",
  "Did you know? Your driver helped a construction company rank #1 in AI search results.",
  "Did you know? Your driver is a family man who builds AI systems by day and drives you safely by night.",
  "Did you know? Your driver builds autonomous AI agent swarms that run entire businesses.",
  "Did you know? Your driver has been building websites since 1999 — before Google was even a year old.",
  "Did you know? Your driver's AI agents answer phone calls, book appointments, and close deals 24/7.",
  "Did you know? Your driver has helped clients generate over $2M in revenue through AI-powered marketing.",
  "Did you know? Your driver codes in 5+ programming languages and speaks 2 human ones.",
];

/* ─────────────────────────────────────────────
   House Rules
   ───────────────────────────────────────────── */
const HOUSE_RULES = [
  { icon: "🚭", rule: "No Smoking or Vaping" },
  { icon: "🍔", rule: "No Eating (Drinks OK)" },
  { icon: "🔊", rule: "Keep Volume Respectful" },
  { icon: "🙏", rule: "Respect the Vehicle" },
];

/* ─────────────────────────────────────────────
   Jokes
   ───────────────────────────────────────────── */
const JOKES = [
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "I'm on a seafood diet.", punchline: "I see food and I eat it." },
  { setup: "My therapist says I have a preoccupation with vengeance.", punchline: "We'll see about that." },
  { setup: "I used to hate facial hair...", punchline: "but then it grew on me." },
  { setup: "I asked the gym instructor to teach me the splits. He said 'How flexible are you?'", punchline: "I said 'I can't make Tuesdays.'" },
  { setup: "My wife told me to stop impersonating a flamingo.", punchline: "I had to put my foot down." },
  { setup: "I told my suitcase we're not going on vacation.", punchline: "Now I'm dealing with emotional baggage." },
  { setup: "What do you call a fake noodle?", punchline: "An impasta." },
  { setup: "I have a fear of speed bumps.", punchline: "But I'm slowly getting over it." },
  { setup: "My doctor told me I'm going deaf.", punchline: "The news was hard for me to hear." },
  { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs." },
  { setup: "I asked my dog what's two minus two.", punchline: "He said nothing." },
];

/* ─────────────────────────────────────────────
   Rideshare Fun Facts
   ───────────────────────────────────────────── */
const RIDESHARE_FACTS = [
  { icon: "🌍", fact: "Uber operates in 70+ countries and 10,000+ cities" },
  { icon: "🚗", fact: "Over 10 billion Uber trips completed worldwide" },
  { icon: "📱", fact: "The first-ever Uber ride was in San Francisco, 2010" },
  { icon: "⭐", fact: "Your driver rates you too — keep it classy!" },
];

/* ─────────────────────────────────────────────
   Zen Quotes
   ───────────────────────────────────────────── */
const ZEN_QUOTES = [
  "The best time to build your brand was yesterday. The second best time is today.",
  "In a world of noise, clarity is your competitive advantage.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "The only way to do great work is to love what you do.",
  "Your future self will thank you for the work you put in today.",
];

/* ─────────────────────────────────────────────
   AI Stats
   ───────────────────────────────────────────── */
const AI_STATS = [
  { value: 97, suffix: "%", label: "Businesses Using AI", prefix: "" },
  { value: 15, suffix: "T", label: "AI Economic Impact", prefix: "$" },
  { value: 10, suffix: "x", label: "Efficiency Gains", prefix: "" },
  { value: 24, suffix: "/7", label: "AI Never Sleeps", prefix: "" },
];

/* ─────────────────────────────────────────────
   Slide definitions (~5 min loop)
   ───────────────────────────────────────────── */
type SlideType =
  | "welcome"
  | "brand"
  | "family"
  | "services"
  | "funfact"
  | "casestudy"
  | "ainumbers"
  | "creative"
  | "ridesharefun"
  | "zen"
  | "houserules"
  | "video"
  | "joke"
  | "connect"
  | "tips"
  | "rate";

interface Slide {
  id: string;
  type: SlideType;
  accent: string;
  bg: string;
  duration?: number;
}

const SLIDES: Slide[] = [
  { id: "welcome",      type: "welcome",      accent: "rgba(122, 67, 230, 0.18)", bg: "/assets/drew_driver_sienna.png",                  duration: 10000 },
  { id: "brand",        type: "brand",        accent: "rgba(168, 85, 247, 0.14)", bg: "/assets/drew_LAB_COAT_2.png",                     duration: 12000 },
  { id: "family",       type: "family",       accent: "rgba(25, 245, 169, 0.12)", bg: "/assets/drew_fam_beach.png",                      duration: 14000 },
  { id: "services",     type: "services",     accent: "rgba(0, 212, 255, 0.12)",  bg: "/assets/drew_uber_driver.png",                    duration: 14000 },
  { id: "funfact1",     type: "funfact",      accent: "rgba(253, 184, 19, 0.14)", bg: "/assets/drew_LAB_COAT_2.png",                     duration: 16000 },
  { id: "econstruct",   type: "casestudy",    accent: "rgba(0, 212, 255, 0.14)",  bg: "/assets/drew_super_laker_dad.png",                duration: 14000 },
  { id: "ainumbers",    type: "ainumbers",     accent: "rgba(168, 85, 247, 0.16)", bg: "/assets/drew_LAB_COAT_2.png",                     duration: 16000 },
  { id: "laso",         type: "casestudy",     accent: "rgba(25, 245, 169, 0.12)", bg: "/assets/portfolio/geo_is_ner_seo_image.jpg",      duration: 14000 },
  { id: "creative",     type: "creative",      accent: "rgba(168, 85, 247, 0.16)", bg: "/assets/portfolio/geo_is_ner_seo_image.jpg",      duration: 12000 },
  { id: "funfact2",     type: "funfact",       accent: "rgba(253, 184, 19, 0.14)", bg: "/assets/drew_uber_driver.png",                   duration: 16000 },
  { id: "ridesharefun", type: "ridesharefun",  accent: "rgba(0, 212, 255, 0.12)",  bg: "/assets/drew_driver_sienna.png",                 duration: 14000 },
  { id: "zen",          type: "zen",           accent: "rgba(25, 245, 169, 0.10)", bg: "/assets/drew_meditate.png",                      duration: 12000 },
  { id: "houserules",   type: "houserules",    accent: "rgba(253, 184, 19, 0.14)", bg: "/assets/drew_uber_driver.png",                   duration: 14000 },
  { id: "video",        type: "video",         accent: "rgba(122, 67, 230, 0.10)", bg: "",                                               duration: 30000 },
  { id: "joke1",        type: "joke",          accent: "rgba(253, 184, 19, 0.12)", bg: "/assets/drew_driver_sienna.png",                 duration: 14000 },
  { id: "joke2",        type: "joke",          accent: "rgba(253, 184, 19, 0.12)", bg: "/assets/drew_uber_driver.png",                   duration: 14000 },
  { id: "connect",      type: "connect",       accent: "rgba(122, 67, 230, 0.14)", bg: "/assets/drew_LAB_COAT_2.png",                    duration: 14000 },
  { id: "tips",         type: "tips",          accent: "rgba(25, 245, 169, 0.14)", bg: "/assets/drew_uber_driver.png",                   duration: 14000 },
  { id: "rate",         type: "rate",          accent: "rgba(253, 184, 19, 0.16)", bg: "/assets/drew_fam_beach.png",                     duration: 12000 },
];
// Total: ~284s ≈ 4 min 44s + transitions ≈ 5 min

const DEFAULT_DURATION = 12000;

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

/* ─── Typewriter ─── */
function Typewriter({ text }: { text: string }) {
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
    <span>
      {displayed}
      <span className="ad-pulse text-[var(--accent-magenta)]">|</span>
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
   SLIDE RENDERERS
   Background is handled by the main component —
   slides only render their content (lightweight).
   ═══════════════════════════════════════════════ */

function WelcomeSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/web_logo.png" alt="Drew Quevedo" width={400} height={100} className="mx-auto" />
      </div>
      <h1 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9] tracking-tight" style={{ animationDelay: "0.2s" }}>
        Welcome
        <br />
        <GradientText className="font-display text-6xl lg:text-8xl uppercase leading-[0.9]">Uber / Lyft Riders</GradientText>
      </h1>
      <p className="ad-fadeUp w-full font-body text-xl lg:text-3xl text-[var(--fg-1)]" style={{ animationDelay: "0.3s" }}>
        Sit back, relax, and enjoy the ride.
      </p>
    </div>
  );
}

function BrandSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp shrink-0" style={{ animationDelay: "0.1s" }}>
        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl border-4 border-[var(--line)]">
          <Image src="/assets/portfolio/drew_tux.png" alt="Drew Quevedo" fill className="object-cover" />
        </div>
      </div>
      <div className="ad-fadeUp" style={{ animationDelay: "0.2s" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/web_logo.png" alt="Drew Quevedo" width={300} height={75} className="mx-auto" />
      </div>
      <p className="ad-fadeUp w-full font-tech text-base lg:text-xl uppercase tracking-[0.16em] text-[var(--accent-magenta)]" style={{ animationDelay: "0.3s" }}>
        AI Strategist &middot; Engineer &middot; Creator &middot; Family Man
      </p>
      <p className="ad-fadeUp w-full max-w-4xl font-body text-xl lg:text-3xl leading-relaxed text-[var(--fg-2)] mx-auto" style={{ animationDelay: "0.4s" }}>
        Building high-performance autonomous brand ecosystems powered by Agentic AI, GEO strategy, and cinematic design.
      </p>
    </div>
  );
}

function FamilySlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip border-[rgba(25,245,169,0.5)] text-[var(--accent-green)] text-lg lg:text-xl px-6 py-2">Family First</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
        <GradientText>Building a Legacy</GradientText>
      </h2>
      <p className="ad-fadeUp w-full max-w-4xl mx-auto font-body text-2xl lg:text-4xl leading-relaxed text-[var(--fg-1)]" style={{ animationDelay: "0.3s" }}>
        AI strategist by day, soccer dad always.
        <br />
        Everything I build is to create a better future for my kids.
      </p>
      <p className="ad-fadeUp font-tech text-base lg:text-xl uppercase tracking-[0.14em] text-[var(--fg-2)]" style={{ animationDelay: "0.4s" }}>
        Faith &middot; Family &middot; Future
      </p>
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
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">What I Do</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
        <GradientText>I Build the Future</GradientText>
      </h2>
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 mx-auto">
        {pillars.map((p, i) => (
          <div
            key={p.label}
            className="ad-fadeUp neo-card flex flex-col items-center gap-3 p-6"
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
          >
            <span className="text-5xl lg:text-6xl">{p.icon}</span>
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-[var(--fg-0)]">{p.label}</span>
            <span className="font-body text-base lg:text-xl text-[var(--fg-2)]">{p.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunFactSlide({ fact }: { fact: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <div className="ad-fadeUp text-6xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
        🧐
      </div>
      <div className="ad-fadeUp" style={{ animationDelay: "0.2s" }}>
        <span className="neo-chip border-[rgba(253,184,19,0.5)] text-[#FDB813] text-lg lg:text-xl px-6 py-2">Fun Fact</span>
      </div>
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
    metrics: { value: number; prefix?: string; suffix?: string; label: string }[];
    tagline: string;
  }> = {
    econstruct: {
      name: "eConstruct Inc",
      logo: "/assets/New-House-Construction-Contractor-ADUs-Builder-Tiny-Homes-in-Los-Angeles-03-01-2026_09_53_PM.png",
      logoBg: "bg-white/10",
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
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">Case Study</span>
      </div>
      <div className={`ad-fadeUp relative h-32 w-72 ${study.logoBg || ""} rounded-xl p-2`} style={{ animationDelay: "0.2s" }}>
        <Image src={study.logo} alt={study.name} fill className="object-contain p-2" />
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.3s" }}>
        {study.name}
      </h2>
      <p className="ad-fadeUp w-full font-tech text-base lg:text-xl uppercase tracking-[0.12em] text-[var(--accent-green)]" style={{ animationDelay: "0.35s" }}>
        {study.tagline}
      </p>
      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 mx-auto">
        {study.metrics.map((m, i) => (
          <CountStat key={m.label} value={m.value} prefix={m.prefix} suffix={m.suffix} label={m.label} delay={600 + i * 200} />
        ))}
      </div>
    </div>
  );
}

function AINumbersSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip border-[rgba(168,85,247,0.5)] text-[var(--accent-magenta)] text-lg lg:text-xl px-6 py-2">The AI Revolution</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
        <GradientText>AI By The Numbers</GradientText>
      </h2>
      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 mx-auto">
        {AI_STATS.map((m, i) => (
          <CountStat key={m.label} value={m.value} prefix={m.prefix} suffix={m.suffix} label={m.label} delay={500 + i * 200} />
        ))}
      </div>
      <p className="ad-fadeUp w-full max-w-3xl mx-auto font-body text-xl lg:text-2xl text-[var(--fg-2)]" style={{ animationDelay: "0.5s" }}>
        Your driver builds the AI systems that power this revolution.
      </p>
    </div>
  );
}

function CreativeSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip border-[rgba(168,85,247,0.5)] text-[var(--accent-magenta)] text-lg lg:text-xl px-6 py-2">Creative AI</span>
      </div>
      <div className="ad-fadeUp relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border-2 border-[var(--line)]" style={{ aspectRatio: "16/9", animationDelay: "0.2s" }}>
        <Image src="/assets/portfolio/geo_is_ner_seo_image.jpg" alt="GEO Music Video" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 text-left">
          <div className="font-display text-3xl lg:text-5xl uppercase tracking-wide">GEO is the New SEO</div>
          <div className="font-tech text-xl text-[var(--fg-2)]">4K Cinematic AI Music Video</div>
        </div>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-4xl lg:text-6xl uppercase leading-[0.9]" style={{ animationDelay: "0.3s" }}>
        Produced in <span className="text-[var(--accent-magenta)]">1.5 Hours</span> with AI
      </h2>
      <p className="ad-fadeUp w-full font-body text-2xl lg:text-3xl text-[var(--fg-2)]" style={{ animationDelay: "0.4s" }}>
        At 5% of traditional cost using OpenArt.ai, Suno, ChatGPT &amp; Whisk
      </p>
    </div>
  );
}

function RideshareFunSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip border-[rgba(0,212,255,0.5)] text-[var(--accent-cyan)] text-lg lg:text-xl px-6 py-2">Rideshare Trivia</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
        The More You Know
      </h2>
      <div className="flex w-full max-w-lg mx-auto flex-col gap-4 mt-2">
        {RIDESHARE_FACTS.map((r, i) => (
          <div
            key={i}
            className="ad-fadeUp neo-card flex items-center gap-6 px-8 py-4 text-left"
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
          >
            <span className="text-4xl lg:text-5xl shrink-0">{r.icon}</span>
            <span className="font-body text-xl lg:text-2xl text-[var(--fg-1)] leading-tight">{r.fact}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZenSlide({ quote }: { quote: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <div className="ad-fadeUp text-6xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
        🧘
      </div>
      <div className="ad-fadeUp" style={{ animationDelay: "0.2s" }}>
        <span className="neo-chip border-[rgba(25,245,169,0.5)] text-[var(--accent-green)] text-lg lg:text-xl px-6 py-2">Zen Moment</span>
      </div>
      <p className="ad-fadeUp w-full max-w-4xl mx-auto font-display text-3xl lg:text-5xl leading-[1.3] text-[var(--fg-0)] italic" style={{ animationDelay: "0.3s" }}>
        &ldquo;{quote}&rdquo;
      </p>
      <p className="ad-fadeUp font-tech text-base lg:text-xl uppercase tracking-[0.14em] text-[var(--fg-2)]" style={{ animationDelay: "0.5s" }}>
        Take a breath. You&apos;re exactly where you need to be.
      </p>
    </div>
  );
}

function VideoSlide({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-12 text-center w-full">
      <div className="ad-fadeUp w-full font-display text-2xl lg:text-4xl uppercase tracking-wide text-[var(--fg-1)]" style={{ animationDelay: "0.1s" }}>
        Now Playing &mdash; GEO is the New SEO
      </div>
      <div
        className="ad-fadeUp relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl border-2 border-[var(--line)]"
        style={{ aspectRatio: "16/9", animationDelay: "0.2s" }}
      >
        {active ? (
          <iframe
            src="https://www.youtube.com/embed/swv_QE6E5X4?autoplay=1&mute=1&loop=1&playlist=swv_QE6E5X4&controls=1&modestbranding=1&rel=0&showinfo=0&playsinline=1"
            title="GEO is the New SEO"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-6xl">▶</span>
          </div>
        )}
      </div>
      <p className="ad-fadeUp font-tech text-base lg:text-xl uppercase tracking-[0.15em] text-[var(--fg-2)]" style={{ animationDelay: "0.3s" }}>
        drewquevedo.com
      </p>
    </div>
  );
}

function HouseRulesSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip border-[rgba(253,184,19,0.5)] text-[#FDB813] text-lg lg:text-xl px-6 py-2">Rider Vibes</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
        <span className="gradient-text">House Rules</span>
      </h2>
      <div className="flex w-full max-w-lg mx-auto flex-col gap-4 mt-4">
        {HOUSE_RULES.map((r, i) => (
          <div
            key={i}
            className="ad-fadeUp neo-card flex items-center gap-6 px-8 py-4 text-left"
            style={{ animationDelay: `${0.3 + i * 0.08}s` }}
          >
            <span className="text-4xl lg:text-5xl shrink-0">{r.icon}</span>
            <span className="font-body text-2xl lg:text-3xl text-[var(--fg-1)] leading-tight">{r.rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JokeSlide({ joke }: { joke: { setup: string; punchline: string } }) {
  const [showPunchline, setShowPunchline] = useState(false);
  useEffect(() => {
    setShowPunchline(false);
    const t = setTimeout(() => setShowPunchline(true), 3000);
    return () => clearTimeout(t);
  }, [joke]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <div className="ad-scaleIn text-6xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
        😂
      </div>
      <p className="ad-fadeUp w-full max-w-5xl mx-auto neo-card font-display text-4xl lg:text-6xl p-8 leading-[1.2] tracking-tight" style={{ animationDelay: "0.3s" }}>
        {joke.setup}
      </p>
      <p
        className={`w-full font-display text-5xl lg:text-7xl leading-[1.1] text-[#FDB813] transition-opacity duration-500 ${showPunchline ? "opacity-100" : "opacity-0"}`}
        style={{ textShadow: "0 0 30px rgba(253, 184, 19, 0.4)" }}
      >
        {joke.punchline}
      </p>
      <div
        className={`w-full font-tech text-base lg:text-xl uppercase tracking-[0.18em] text-[var(--fg-2)] mt-4 transition-opacity duration-500 ${showPunchline ? "opacity-100" : "opacity-0"}`}
      >
        Your driver is also a comedian (apparently)
      </div>
    </div>
  );
}

function ConnectSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">Connect</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
        <GradientText>Let&apos;s Build Something</GradientText>
      </h2>
      <div className="ad-fadeUp flex flex-col items-center mt-4" style={{ animationDelay: "0.3s" }}>
        <div className="relative h-64 w-64 lg:h-80 lg:w-80 overflow-hidden rounded-2xl bg-white p-2">
          <Image src="/assets/QR-Code.png" alt="QR Code" fill className="object-contain p-2" />
        </div>
        <p className="mt-4 font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-2)]">Scan to visit drewquevedo.com</p>
      </div>
      <div className="ad-fadeUp flex flex-wrap justify-center gap-4 font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-1)] mt-4" style={{ animationDelay: "0.4s" }}>
        <span>@drewquevedo</span>
        <span className="text-[var(--line)]">|</span>
        <span>dq@drewquevedo.com</span>
      </div>
      <div className="ad-fadeUp font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-2)]" style={{ animationDelay: "0.45s" }}>
        LinkedIn &middot; Instagram &middot; YouTube
      </div>
    </div>
  );
}

function TipsSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-12 text-center w-full">
      <div className="ad-fadeUp text-6xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
        🙏
      </div>
      <h2 className="ad-fadeUp w-full font-display text-5xl lg:text-7xl uppercase leading-[0.9]" style={{ animationDelay: "0.2s" }}>
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
      </h2>
      <div className="ad-fadeUp flex flex-col items-center gap-4 mt-4" style={{ animationDelay: "0.25s" }}>
        <p className="font-tech text-xl uppercase tracking-[0.12em] text-[var(--fg-2)]">Cash App</p>
        <div className="relative h-64 w-64 lg:h-80 lg:w-80 overflow-hidden rounded-2xl border-4 border-[#00D632]">
          <Image src="/assets/Screenshot_20260306_211612_Cash App.jpg" alt="Cash App QR" fill className="object-cover" />
        </div>
        <p className="font-tech text-4xl text-[#00D632] mt-2">$drewq08</p>
      </div>
      <p className="ad-fadeUp w-full max-w-3xl mx-auto font-body text-2xl lg:text-3xl text-[var(--fg-2)] mt-4" style={{ animationDelay: "0.35s" }}>
        Your generosity keeps this ride experience premium. Thank you!
      </p>
    </div>
  );
}

function RateSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-12 text-center w-full">
      <div className="ad-fadeUp" style={{ animationDelay: "0.1s" }}>
        <span className="neo-chip text-lg lg:text-xl px-6 py-2">Uber / Lyft Riders</span>
      </div>
      <h2 className="ad-fadeUp w-full font-display text-6xl lg:text-8xl uppercase leading-[0.9]" style={{ animationDelay: "0.25s" }}>
        Thanks for Riding!
      </h2>
      <p className="ad-fadeUp w-full max-w-4xl mx-auto font-body text-2xl lg:text-4xl text-[var(--fg-1)]" style={{ animationDelay: "0.35s" }}>
        If you enjoyed the experience, a 5-star rating means the world. Have an amazing day!
      </p>
      <div className="ad-fadeUp mt-8" style={{ animationDelay: "0.45s" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/web_logo.png" alt="Drew Quevedo" width={250} height={60} className="mx-auto opacity-40" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function AdvertiseDrivePage() {
  const [current, setCurrent] = useState(0);
  const [currentFact, setCurrentFact] = useState(() => pickRandom(FUN_FACTS));
  const [currentJoke, setCurrentJoke] = useState(() => pickRandom(JOKES));
  const [currentZen, setCurrentZen] = useState(() => pickRandom(ZEN_QUOTES));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = (prev + 1) % SLIDES.length;
      if (SLIDES[next]?.type === "funfact") setCurrentFact(pickRandom(FUN_FACTS));
      if (SLIDES[next]?.type === "joke") setCurrentJoke(pickRandom(JOKES));
      if (SLIDES[next]?.type === "zen") setCurrentZen(pickRandom(ZEN_QUOTES));
      return next;
    });
  }, []);

  useEffect(() => {
    const dur = SLIDES[current]?.duration || DEFAULT_DURATION;
    timerRef.current = setTimeout(advanceSlide, dur);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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
  const dur = slide.duration || DEFAULT_DURATION;

  function renderSlide() {
    switch (slide.type) {
      case "welcome":      return <WelcomeSlide />;
      case "brand":        return <BrandSlide />;
      case "family":       return <FamilySlide />;
      case "services":     return <ServicesSlide />;
      case "funfact":      return <FunFactSlide fact={currentFact} />;
      case "casestudy":    return <CaseStudySlide id={slide.id} />;
      case "ainumbers":    return <AINumbersSlide />;
      case "creative":     return <CreativeSlide />;
      case "ridesharefun": return <RideshareFunSlide />;
      case "zen":          return <ZenSlide quote={currentZen} />;
      case "houserules":   return <HouseRulesSlide />;
      case "video":        return <VideoSlide active />;
      case "joke":         return <JokeSlide joke={currentJoke} />;
      case "connect":      return <ConnectSlide />;
      case "tips":         return <TipsSlide />;
      case "rate":         return <RateSlide />;
      default:             return null;
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
        @keyframes shimmerGold {
          0% { background-position: -200% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes adFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes adFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes adScaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes adSlideIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes adProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes adPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .ad-fadeUp {
          opacity: 0;
          animation: adFadeUp 0.45s ease-out forwards;
        }
        .ad-fadeIn {
          opacity: 0;
          animation: adFadeIn 0.5s ease-out forwards;
        }
        .ad-scaleIn {
          opacity: 0;
          animation: adScaleIn 0.4s ease-out forwards;
        }
        .ad-pulse {
          animation: adPulse 1s ease-in-out infinite;
        }
      `}</style>

      {/* ── PERSISTENT background layer (never re-mounts) ── */}
      {slide.bg && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.bg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.4] transition-opacity duration-700"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, var(--bg-0) 0%, rgba(5,6,10,0.7) 50%, rgba(5,6,10,0.3) 100%)" }}
          />
        </div>
      )}

      {/* Radial accent glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${slide.accent}, transparent)` }}
      />

      {/* ── Slide content (key re-mounts lightweight content only) ── */}
      <div
        key={current}
        className="relative z-10 h-full w-full"
        style={{ animation: "adSlideIn 0.5s ease-out" }}
      >
        {renderSlide()}
      </div>

      {/* ── Progress bar (pure CSS animation) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-[4px] bg-white/5">
        <div
          key={`p-${current}`}
          className="h-full"
          style={{
            animation: `adProgress ${dur}ms linear forwards`,
            background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))",
            boxShadow: "0 0 12px rgba(122, 67, 230, 0.5)",
          }}
        />
      </div>

      {/* Slide indicator dots */}
      <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "h-2 w-6 bg-[var(--accent-magenta)]" : "h-2 w-2 bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
