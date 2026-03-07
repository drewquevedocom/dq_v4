"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Fun Facts — each paired with a background image
   ───────────────────────────────────────────── */
const FUN_FACTS = [
  { text: "Did you know? Your driver built a website for the Vatican & Pope John Paul II in 2001 — commissioned by a Vatican attorney.", bgImage: "/assets/portfolio/drew_vatican_2001.jpg" },
  { text: "Did you know? Your driver built AI systems that automate 60+ hours of work per month for medical companies.", bgImage: "/assets/portfolio/Whisk_a0ef32009d0bdc6b50548b2187d24e60dr.jpeg" },
  { text: "Did you know? Your driver produced a 4K music video in 1.5 hours using AI — at 5% of traditional cost.", bgImage: "/assets/portfolio/geo_is_ner_seo_image.jpg" },
  { text: "Did you know? Your driver helped a construction company rank #1 in AI search results.", bgImage: "/assets/portfolio/econstruct.png" },
  { text: "Did you know? Your driver is a family man who builds AI systems by day and drives you safely by night.", bgImage: "/assets/portfolio/drew_family.jpg" },
  { text: "Did you know? Your driver builds autonomous AI agent swarms that run entire businesses.", bgImage: "/assets/portfolio/The Scientist.jpeg" },
  { text: "Did you know? Your driver has been building websites since 1999 — before Google was even a year old.", bgImage: "/assets/portfolio/Whisk_jdlmthjowy.jpg" },
  { text: "Did you know? Your driver\u2019s AI agents answer phone calls, book appointments, and close deals 24/7.", bgImage: "/assets/portfolio/Whisk_506428d85300761ae7146898ba6eb687dr.jpeg" },
];

/* ─────────────────────────────────────────────
   Jokes — general audience, actually funny
   ───────────────────────────────────────────── */
const JOKES = [
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "I\u2019m on a seafood diet.", punchline: "I see food and I eat it." },
  { setup: "My therapist says I have a preoccupation with vengeance.", punchline: "We\u2019ll see about that." },
  { setup: "I used to hate facial hair...", punchline: "but then it grew on me." },
  { setup: "I asked the gym instructor to teach me the splits. He said \u2018How flexible are you?\u2019", punchline: "I said \u2018I can\u2019t make Tuesdays.\u2019" },
  { setup: "My wife told me to stop impersonating a flamingo.", punchline: "I had to put my foot down." },
  { setup: "I told my suitcase we\u2019re not going on vacation.", punchline: "Now I\u2019m dealing with emotional baggage." },
  { setup: "What do you call a fake noodle?", punchline: "An impasta." },
  { setup: "I have a fear of speed bumps.", punchline: "But I\u2019m slowly getting over it." },
  { setup: "My doctor told me I\u2019m going deaf.", punchline: "The news was hard for me to hear." },
];

/* ─────────────────────────────────────────────
   House Rules — edgy, funny
   ───────────────────────────────────────────── */
const HOUSE_RULES = [
  { icon: "\u2728", rule: "Good vibes only. Bad vibes get dropped at the next corner." },
  { icon: "\uD83C\uDFB5", rule: "DJ requests welcome. Except Nickelback." },
  { icon: "\uD83D\uDD0C", rule: "Phone charger in the back. You\u2019re welcome." },
  { icon: "\u2B50", rule: "Rate 5 stars or this screen plays Baby Shark on loop." },
  { icon: "\uD83C\uDFC6", rule: "Uber 4.95 \u00B7 Lyft 5.0 \u2014 Help keep the streak alive." },
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
  duration?: number;
}

const SLIDES: Slide[] = [
  { id: "welcome",    type: "welcome",    accent: "rgba(122, 67, 230, 0.18)" },
  { id: "brand",      type: "brand",      accent: "rgba(168, 85, 247, 0.14)" },
  { id: "services",   type: "services",   accent: "rgba(0, 212, 255, 0.12)" },
  { id: "funfact",    type: "funfact",    accent: "rgba(253, 184, 19, 0.14)" },
  { id: "econstruct", type: "casestudy",  accent: "rgba(0, 212, 255, 0.14)" },
  { id: "laso",       type: "casestudy",  accent: "rgba(25, 245, 169, 0.12)" },
  { id: "creative",   type: "creative",   accent: "rgba(168, 85, 247, 0.16)" },
  { id: "video",      type: "video",      accent: "rgba(122, 67, 230, 0.10)", duration: 30000 },
  { id: "houserules", type: "houserules", accent: "rgba(253, 184, 19, 0.14)" },
  { id: "joke",       type: "joke",       accent: "rgba(253, 184, 19, 0.12)" },
  { id: "connect",    type: "connect",    accent: "rgba(122, 67, 230, 0.14)" },
  { id: "tips",       type: "tips",       accent: "rgba(25, 245, 169, 0.14)" },
  { id: "rate",       type: "rate",       accent: "rgba(253, 184, 19, 0.16)" },
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

/* ─── Decimal counter (for 4.95 etc) ─── */
function useCountUpDecimal(target: number, decimals: number = 2, duration: number = 1500, delay: number = 400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(parseFloat((target * eased).toFixed(decimals)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, decimals, duration, delay]);
  return value;
}

/* ─── QR Code SVG (drewquevedo.com) ─── */
function QRCode() {
  return (
    <div className="relative mx-auto h-24 w-24 rounded-xl bg-white p-2">
      <svg viewBox="0 0 29 29" className="h-full w-full">
        <rect x="0" y="0" width="7" height="7" fill="#000" />
        <rect x="1" y="1" width="5" height="5" fill="#fff" />
        <rect x="2" y="2" width="3" height="3" fill="#000" />
        <rect x="22" y="0" width="7" height="7" fill="#000" />
        <rect x="23" y="1" width="5" height="5" fill="#fff" />
        <rect x="24" y="2" width="3" height="3" fill="#000" />
        <rect x="0" y="22" width="7" height="7" fill="#000" />
        <rect x="1" y="23" width="5" height="5" fill="#fff" />
        <rect x="2" y="24" width="3" height="3" fill="#000" />
        {[
          [8,0],[10,0],[11,0],[13,0],[15,0],[17,0],[19,0],[20,0],
          [8,1],[9,1],[12,1],[14,1],[16,1],[18,1],[20,1],
          [8,2],[10,2],[11,2],[13,2],[15,2],[19,2],[20,2],
          [8,3],[9,3],[11,3],[14,3],[16,3],[17,3],[20,3],
          [8,4],[10,4],[12,4],[13,4],[15,4],[18,4],[19,4],[20,4],
          [8,5],[9,5],[11,5],[14,5],[16,5],[20,5],
          [8,6],[10,6],[12,6],[13,6],[15,6],[17,6],[18,6],[19,6],[20,6],
          [0,8],[2,8],[4,8],[6,8],[8,8],[10,8],[12,8],[14,8],[16,8],[18,8],[20,8],[22,8],[24,8],[26,8],[28,8],
          [1,9],[3,9],[5,9],[9,9],[11,9],[13,9],[15,9],[19,9],[23,9],[25,9],[27,9],
          [0,10],[2,10],[6,10],[8,10],[10,10],[14,10],[16,10],[18,10],[20,10],[22,10],[24,10],[28,10],
          [1,11],[3,11],[5,11],[9,11],[11,11],[13,11],[17,11],[19,11],[23,11],[27,11],
          [0,12],[4,12],[6,12],[8,12],[12,12],[14,12],[16,12],[18,12],[20,12],[22,12],[26,12],[28,12],
          [3,13],[5,13],[9,13],[11,13],[15,13],[17,13],[19,13],[25,13],[27,13],
          [0,14],[2,14],[4,14],[8,14],[10,14],[12,14],[14,14],[16,14],[20,14],[22,14],[24,14],[26,14],[28,14],
          [9,22],[11,22],[13,22],[15,22],[17,22],[19,22],[22,22],[24,22],[26,22],
          [8,23],[10,23],[12,23],[14,23],[16,23],[18,23],[20,23],[23,23],[25,23],[27,23],
          [9,24],[11,24],[13,24],[15,24],[19,24],[22,24],[24,24],[28,24],
          [8,25],[10,25],[12,25],[16,25],[18,25],[20,25],[23,25],[25,25],[27,25],
          [9,26],[13,26],[15,26],[17,26],[19,26],[22,26],[24,26],[26,26],[28,26],
          [8,27],[10,27],[12,27],[14,27],[16,27],[18,27],[20,27],[23,27],[27,27],
          [9,28],[11,28],[13,28],[15,28],[19,28],[22,28],[24,28],[26,28],[28,28],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />
        ))}
      </svg>
    </div>
  );
}

/* ─── Reusable slide background image with gradient overlay ─── */
function SlideBg({ src, gradient }: { src: string; gradient?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        onError={() => setFailed(true)}
        priority={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background: gradient || "linear-gradient(to top, #05060a 0%, rgba(5,6,10,0.75) 40%, rgba(5,6,10,0.35) 100%)",
        }}
      />
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
    <div className="neo-card px-3 py-3 backdrop-blur-sm bg-[rgba(5,6,10,0.6)]">
      <div className="font-tech text-xl font-bold text-[var(--accent-cyan)]">
        {prefix}{count}{suffix}
      </div>
      <div className="mt-0.5 font-body text-xs text-[var(--fg-2)]">{label}</div>
    </div>
  );
}

/* ─── Rating badge ─── */
function RatingBadge({ platform, rating, delay }: { platform: string; rating: number; delay: number }) {
  const count = useCountUpDecimal(rating, 2, 1200, delay);
  return (
    <div className="neo-card px-3 py-2 backdrop-blur-sm bg-[rgba(5,6,10,0.5)]">
      <div className="font-tech text-xs uppercase tracking-[0.12em] text-[var(--fg-2)]">{platform}</div>
      <div className="font-display text-xl font-bold text-[#FDB813]">
        {count.toFixed(platform === "Lyft" ? 1 : 2)}
      </div>
    </div>
  );
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   SLIDE RENDERERS \u2014 every slide has a background image
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

function WelcomeSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/drew_driving_pov.jpg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <Image src="/assets/web_logo.png" alt="Drew Quevedo" width={220} height={55} className="mx-auto" priority />
        </motion.div>
        <motion.h1
          custom={1}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full font-display text-[7vw] uppercase leading-[0.9] tracking-tight"
        >
          Welcome
          <br />
          <GradientText className="font-display text-[9vw] uppercase leading-[0.9]">Uber / Lyft Riders</GradientText>
        </motion.h1>
        <motion.div custom={2} variants={stagger} initial="hidden" animate="show" className="flex gap-3">
          <RatingBadge platform="Uber" rating={4.95} delay={600} />
          <RatingBadge platform="Lyft" rating={5.0} delay={800} />
        </motion.div>
        <motion.p
          custom={3}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full font-body text-sm text-[var(--fg-1)]"
        >
          Sit back, relax, and enjoy the ride.
        </motion.p>
      </div>
    </div>
  );
}

function BrandSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/drew_family.jpg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="shrink-0">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl border-2 border-white/20 shadow-lg shadow-purple-500/20">
            <Image src="/assets/portfolio/drew_tux.png" alt="Drew Quevedo" fill className="object-cover" />
          </div>
        </motion.div>
        <motion.div custom={1} variants={stagger} initial="hidden" animate="show">
          <Image src="/assets/web_logo.png" alt="Drew Quevedo" width={180} height={45} className="mx-auto" />
        </motion.div>
        <motion.p custom={2} variants={stagger} initial="hidden" animate="show" className="w-full font-tech text-sm uppercase tracking-[0.16em] text-[var(--accent-magenta)]">
          AI Strategist &middot; Creator &middot; People Mover &middot; Family Man
        </motion.p>
        <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full font-body text-sm leading-relaxed text-[var(--fg-1)]">
          Building high-performance autonomous brand ecosystems powered by Agentic AI Agents, GEO strategy, and cinematic AI design.
        </motion.p>
      </div>
    </div>
  );
}

function ServicesSlide() {
  const pillars = [
    { icon: "\uD83C\uDFAF", label: "GEO Strategy", desc: "Search Optimization" },
    { icon: "\uD83E\uDD16", label: "Agentic AI", desc: "Autonomous Agents" },
    { icon: "\u2699\uFE0F", label: "Engineering", desc: "Full-Stack Apps" },
    { icon: "\uD83C\uDFA8", label: "Creative", desc: "AI Content" },
  ];
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/The Scientist.jpeg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip text-xs backdrop-blur-sm">What I Do</span>
        </motion.div>
        <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[6vw] uppercase leading-[0.9]">
          <GradientText>I Build the Future</GradientText>
        </motion.h2>
        <div className="grid w-full grid-cols-2 gap-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              custom={i + 2}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="neo-card flex flex-col items-center gap-1.5 p-3 backdrop-blur-sm bg-[rgba(5,6,10,0.6)]"
            >
              <span className="text-xl">{p.icon}</span>
              <span className="font-display text-sm uppercase tracking-wide text-[var(--fg-0)]">{p.label}</span>
              <span className="font-body text-xs text-[var(--fg-2)]">{p.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FunFactSlide({ fact }: { fact: { text: string; bgImage: string } }) {
  return (
    <div className="relative h-full w-full">
      <SlideBg src={fact.bgImage} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="text-2xl">
          \uD83E\uDDD0
        </motion.div>
        <motion.div custom={1} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip border-[rgba(253,184,19,0.5)] text-[#FDB813] text-xs backdrop-blur-sm">Fun Fact</span>
        </motion.div>
        <div className="w-full neo-card backdrop-blur-sm bg-[rgba(5,6,10,0.65)] p-4 rounded-xl">
          <div className="font-body text-[3.2vw] leading-[1.4]">
            <Typewriter text={fact.text} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudySlide({ id }: { id: string }) {
  const studies: Record<string, {
    name: string;
    logo: string;
    logoBg?: string;
    bgImage: string;
    metrics: { value: number; prefix?: string; suffix?: string; label: string }[];
    tagline: string;
  }> = {
    econstruct: {
      name: "eConstruct Inc",
      logo: "/assets/portfolio/econstruct_logo.png",
      logoBg: "bg-white/10",
      bgImage: "/assets/portfolio/econstruct.png",
      metrics: [
        { value: 4.2, suffix: "x", label: "GEO Citations", prefix: "" },
        { value: 310, suffix: "%", label: "Organic Traffic", prefix: "+" },
        { value: 1, suffix: "", label: "AI Search Rank", prefix: "#" },
        { value: 3, suffix: "x", label: "Lead Pipeline", prefix: "" },
      ],
      tagline: "GEO-first strategy for High End Residential Construction, Custom AI Lead Management System, AI CEO Dashboard",
    },
    laso: {
      name: "Laso Imaging",
      logo: "/assets/portfolio/laso.png",
      bgImage: "/assets/portfolio/Whisk_a0ef32009d0bdc6b50548b2187d24e60dr.jpeg",
      metrics: [
        { value: 7, suffix: "", label: "AI Agent Swarm", prefix: "" },
        { value: 85, suffix: "%", label: "Faster Response", prefix: "-" },
        { value: 60, suffix: "hrs", label: "Monthly Saved", prefix: "" },
        { value: 99, suffix: "%", label: "Uptime", prefix: "" },
      ],
      tagline: "7-Agent AI Swarm \u00B7 CEO Dashboard \u00B7 Shopify Cart",
    },
  };
  const study = studies[id];
  if (!study) return null;

  return (
    <div className="relative h-full w-full">
      <SlideBg src={study.bgImage} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip text-xs backdrop-blur-sm">Case Study</span>
        </motion.div>
        <motion.div custom={1} variants={stagger} initial="hidden" animate="show" className={`relative h-12 w-40 ${study.logoBg || ""} rounded-lg backdrop-blur-sm`}>
          <Image src={study.logo} alt={study.name} fill className="object-contain p-1" />
        </motion.div>
        <motion.h2 custom={2} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[5vw] uppercase leading-[0.9]">
          {study.name}
        </motion.h2>
        <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full font-tech text-sm uppercase tracking-[0.12em] text-[var(--accent-green)]">
          {study.tagline}
        </motion.p>
        <div className="grid w-full grid-cols-2 gap-2">
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
    </div>
  );
}

function CreativeSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/geo_is_ner_seo_image.jpg" gradient="linear-gradient(to top, #05060a 0%, rgba(5,6,10,0.85) 50%, rgba(5,6,10,0.4) 100%)" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip border-[rgba(168,85,247,0.5)] text-[var(--accent-magenta)] text-xs backdrop-blur-sm">Creative AI</span>
        </motion.div>
        <motion.div custom={1} variants={stagger} initial="hidden" animate="show" className="relative w-full overflow-hidden rounded-xl border border-[var(--line)]" style={{ aspectRatio: "16/9" }}>
          <Image src="/assets/portfolio/geo_is_ner_seo_image.jpg" alt="GEO Music Video" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 text-left">
            <div className="font-display text-sm uppercase tracking-wide">GEO is the New SEO</div>
            <div className="font-tech text-xs text-[var(--fg-2)]">4K Cinematic AI Music Video</div>
          </div>
        </motion.div>
        <motion.h2 custom={2} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[5vw] uppercase leading-[0.9]">
          Produced in <span className="text-[var(--accent-magenta)]">1.5 Hours</span> with AI
        </motion.h2>
        <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full font-body text-sm text-[var(--fg-2)]">
          At 5% of traditional cost using OpenArt.ai, Suno, ChatGPT &amp; Whisk
        </motion.p>
      </div>
    </div>
  );
}

function VideoSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
      <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[3vw] uppercase tracking-wide text-[var(--fg-1)]">
        Now Playing &mdash; GEO is the New SEO
      </motion.div>
      <motion.div
        custom={1}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative w-full overflow-hidden rounded-xl border border-[var(--line)]"
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
      <motion.p custom={2} variants={stagger} initial="hidden" animate="show" className="font-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-2)]">
        drewquevedo.com
      </motion.p>
    </div>
  );
}

function HouseRulesSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/drew_superhero_rideshare.jpg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip border-[rgba(253,184,19,0.5)] text-[#FDB813] text-xs backdrop-blur-sm">Rider Vibes</span>
        </motion.div>
        <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[5vw] uppercase leading-[0.9]">
          <GradientText>House Rules</GradientText>
        </motion.h2>
        <div className="w-full space-y-1.5">
          {HOUSE_RULES.map((r, i) => (
            <motion.div
              key={i}
              custom={i + 2}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="neo-card flex items-center gap-2 px-3 py-2 text-left backdrop-blur-sm bg-[rgba(5,6,10,0.6)]"
            >
              <span className="text-base shrink-0">{r.icon}</span>
              <span className="font-body text-sm text-[var(--fg-1)] leading-snug">{r.rule}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JokeSlide({ joke }: { joke: { setup: string; punchline: string } }) {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/drew_kobe_3pointer.jpg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-3xl"
        >
          \uD83D\uDE02
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full neo-card backdrop-blur-sm bg-[rgba(5,6,10,0.65)] p-4 rounded-xl font-display text-[4vw] leading-[1.2] tracking-tight"
        >
          {joke.setup}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5, type: "spring", stiffness: 200 }}
          className="w-full font-display text-[5vw] leading-[1.1] text-[#FDB813]"
          style={{ textShadow: "0 0 30px rgba(253, 184, 19, 0.4)" }}
        >
          {joke.punchline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 0.5 }}
          className="w-full font-tech text-xs uppercase tracking-[0.18em] text-[var(--fg-2)]"
        >
          Your driver is also a comedian (apparently)
        </motion.div>
      </div>
    </div>
  );
}

function ConnectSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/Whisk_jdlmthjowy.jpg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip text-xs backdrop-blur-sm">Connect</span>
        </motion.div>
        <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[5.5vw] uppercase leading-[0.9]">
          <GradientText>Let&apos;s Build Something</GradientText>
        </motion.h2>
        <motion.div custom={2} variants={stagger} initial="hidden" animate="show">
          <QRCode />
          <p className="mt-2 font-tech text-xs uppercase tracking-[0.12em] text-[var(--fg-2)]">Scan to visit drewquevedo.com</p>
        </motion.div>
        <motion.div custom={3} variants={stagger} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-2 font-tech text-xs uppercase tracking-[0.12em] text-[var(--fg-1)]">
          <span>@drewquevedo</span>
          <span className="text-[var(--line)]">|</span>
          <span>dq@drewquevedo.com</span>
        </motion.div>
        <motion.div custom={4} variants={stagger} initial="hidden" animate="show" className="font-tech text-xs uppercase tracking-[0.12em] text-[var(--fg-2)]">
          LinkedIn &middot; Instagram &middot; YouTube
        </motion.div>
      </div>
    </div>
  );
}

function TipsSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/drew_meditate_dark.png" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="text-3xl">
          \uD83D\uDE4F
        </motion.div>
        <motion.h2 custom={1} variants={stagger} initial="hidden" animate="show" className="w-full font-display text-[6vw] uppercase leading-[0.9]">
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
        <motion.div custom={2} variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center gap-2">
          <p className="font-tech text-xs uppercase tracking-[0.12em] text-[var(--fg-2)]">Cash App</p>
          <div className="relative h-24 w-24 overflow-hidden rounded-lg">
            <Image src="/assets/Screenshot_20260306_211612_Cash App.jpg" alt="Cash App QR" fill className="object-cover rounded-lg" />
          </div>
          <p className="font-tech text-sm text-[var(--accent-green)]">$drewq08</p>
        </motion.div>
        <motion.p custom={3} variants={stagger} initial="hidden" animate="show" className="w-full font-body text-sm text-[var(--fg-2)]">
          Your generosity keeps this ride experience premium. Thank you!
        </motion.p>
      </div>
    </div>
  );
}

function RateSlide() {
  return (
    <div className="relative h-full w-full">
      <SlideBg src="/assets/portfolio/drew_family.jpg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="show">
          <span className="neo-chip text-xs backdrop-blur-sm">Uber / Lyft Riders</span>
        </motion.div>
        <div className="w-full font-display text-[6vw] uppercase leading-[0.9]">
          <WaveText text="Thanks for Riding!" />
        </div>
        <motion.p
          custom={2}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full font-body text-sm text-[var(--fg-1)]"
        >
          If you enjoyed the experience, a 5-star rating means the world. Have an amazing day!
        </motion.p>
        <motion.div custom={3} variants={stagger} initial="hidden" animate="show">
          <Image src="/assets/web_logo.png" alt="Drew Quevedo" width={140} height={35} className="mx-auto opacity-40" />
        </motion.div>
      </div>
    </div>
  );
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   MAIN COMPONENT
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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
      <div className="fixed bottom-0 left-0 right-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full transition-none"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))",
            boxShadow: "0 0 8px rgba(122, 67, 230, 0.5)",
          }}
        />
      </div>

      {/* Slide indicator dots */}
      <div className="fixed bottom-2 left-1/2 z-50 flex -translate-x-1/2 gap-1">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "h-1 w-4 bg-[var(--accent-magenta)]" : "h-1 w-1 bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
