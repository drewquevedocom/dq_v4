"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────────────────────────
   Fun Facts — each paired with a background image
   ───────────────────────────────────────────── */
const FUN_FACTS = [
  { text: "Did you know? Your driver built a website for the Vatican & Pope John Paul II in 2001 — commissioned by a Vatican attorney.", bgImage: "/assets/portfolio/drew_vatican_2001.jpg" },
  { text: "Did you know? Your driver built AI systems that automate 60+ hours of work per month for medical companies.", bgImage: "/assets/portfolio/Whisk_a0ef32009d0bdc6b50548b2187d24e60dr.jpeg" },
  { text: "Did you know? Your driver produced a 4K music video in 1.5 hours using AI — at 5% of traditional cost.", bgImage: "/assets/portfolio/geo_is_ner_seo_image.jpg" },
  { text: "Did you know? Your driver helped a construction company rank #1 in AI search results.", bgImage: "/assets/drew_uber_driver.png" },
  { text: "Did you know? Your driver is a family man who builds AI systems by day and drives you safely by night.", bgImage: "/assets/drew_fam_beach.png" },
  { text: "Did you know? Your driver builds autonomous AI agent swarms that run entire businesses.", bgImage: "/assets/drew_LAB_COAT_2.png" },
  { text: "Did you know? Your driver has been building websites since 1999 — before Google was even a year old.", bgImage: "/assets/portfolio/Whisk_jdlmthjowy.jpg" },
  { text: "Did you know? Your driver\u2019s AI agents answer phone calls, book appointments, and close deals 24/7.", bgImage: "/assets/portfolio/Whisk_506428d85300761ae7146898ba6eb687dr.jpeg" },
];

/* ─────────────────────────────────────────────
   Jokes — mix of regular jokes + dad jokes
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
  { setup: "Why don\u2019t eggs tell jokes?", punchline: "They\u2019d crack each other up." },
  { setup: "I\u2019m reading a book about anti-gravity.", punchline: "It\u2019s impossible to put down." },
  { setup: "What did the ocean say to the beach?", punchline: "Nothing, it just waved." },
  { setup: "I used to play piano by ear.", punchline: "Now I use my hands." },
  { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field." },
  { setup: "I told my daughter she was drawing her eyebrows too low.", punchline: "She looked angry." },
  { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear." },
  { setup: "Why do fathers take an extra pair of socks when they go golfing?", punchline: "In case they get a hole in one." },
  { setup: "I only know 25 letters of the alphabet.", punchline: "I don\u2019t know Y." },
  { setup: "What did the coffee report to the police?", punchline: "A mugging." },
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
  { id: "welcome", type: "welcome", accent: "rgba(122, 67, 230, 0.18)" },
  { id: "brand", type: "brand", accent: "rgba(168, 85, 247, 0.14)" },
  { id: "services", type: "services", accent: "rgba(0, 212, 255, 0.12)" },
  { id: "funfact", type: "funfact", accent: "rgba(253, 184, 19, 0.14)" },
  { id: "econstruct", type: "casestudy", accent: "rgba(0, 212, 255, 0.14)" },
  { id: "laso", type: "casestudy", accent: "rgba(25, 245, 169, 0.12)" },
  { id: "creative", type: "creative", accent: "rgba(168, 85, 247, 0.16)" },
  { id: "houserules", type: "houserules", accent: "rgba(253, 184, 19, 0.14)" },
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

/* ─── Typewriter (pure JS) ─── */
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
      <span style={{ animation: "pulse 1s infinite", color: "var(--accent-magenta)" }}>|</span>
    </span>
  );
}

/* ─── Background image with gradient overlay (plain img) ─── */
function SlideBg({ src, gradient }: { src: string; gradient?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <div
        style={{
          position: "absolute", inset: 0,
          background: gradient || "linear-gradient(to top, #05060a 0%, rgba(5,6,10,0.75) 40%, rgba(5,6,10,0.35) 100%)",
        }}
      />
    </>
  );
}

/* ─── Counter stat (static) ─── */
function CountStat({ value, prefix, suffix, label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  return (
    <div className="neo-card" style={{ padding: "2vw", backdropFilter: "blur(4px)", background: "rgba(5,6,10,0.6)" }}>
      <div className="font-tech" style={{ fontSize: "8vw", fontWeight: 700, color: "var(--accent-cyan)" }}>
        {prefix}{Number.isInteger(value) ? value : value.toFixed(1)}{suffix}
      </div>
      <div className="font-body" style={{ marginTop: 2, fontSize: "10vw", color: "var(--fg-2)" }}>{label}</div>
    </div>
  );
}

/* ─── Rating badge (static) ─── */
function RatingBadge({ platform, rating }: { platform: string; rating: number }) {
  return (
    <div className="neo-card" style={{ padding: "2vw 3vw", backdropFilter: "blur(4px)", background: "rgba(5,6,10,0.5)" }}>
      <div className="font-tech" style={{ fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-2)" }}>{platform}</div>
      <div className="font-display" style={{ fontSize: "8vw", fontWeight: 700, color: "#FDB813" }}>
        {rating.toFixed(platform === "Lyft" ? 1 : 2)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SLIDE RENDERERS
   ═══════════════════════════════════════════════ */

function WelcomeSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/drew_driver_sienna.png" />
      <div className="slide-content">
        <div className="stagger-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/web_logo.png" alt="Drew Quevedo" style={{ margin: "0 auto", width: "90vw", height: "auto" }} />
        </div>
        <h1 className="stagger-2 font-display" style={{ width: "100%", fontSize: "7vw", textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.01em" }}>
          Welcome
          <br />
          <span className="gradient-text font-display" style={{ fontSize: "9vw", lineHeight: 0.9 }}>Uber / Lyft Riders</span>
        </h1>
        <div className="stagger-3" style={{ display: "flex", gap: "3vw" }}>
          <RatingBadge platform="Uber" rating={4.95} />
          <RatingBadge platform="Lyft" rating={5.0} />
        </div>
        <p className="stagger-4 font-body" style={{ width: "100%", fontSize: "12vw", color: "var(--fg-1)" }}>
          Sit back, relax, and enjoy the ride.
        </p>
      </div>
    </div>
  );
}

function BrandSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/drew_fam_beach.png" />
      <div className="slide-content" style={{ gap: "2vw" }}>
        <div className="stagger-1" style={{ flexShrink: 0 }}>
          <div style={{ position: "relative", margin: "0 auto", height: "28vw", width: "28vw", overflow: "hidden", borderRadius: "2vw", border: "2px solid rgba(255,255,255,0.2)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/portfolio/drew_tux.png" alt="Drew Quevedo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div className="stagger-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/web_logo.png" alt="Drew Quevedo" style={{ margin: "0 auto", width: "80vw", height: "auto" }} />
        </div>
        <p className="stagger-3 font-tech" style={{ width: "100%", fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--accent-magenta)" }}>
          AI Strategist &middot; Creator &middot; People Mover &middot; Family Man
        </p>
        <p className="stagger-4 font-body" style={{ width: "100%", fontSize: "12vw", lineHeight: 1.4, color: "var(--fg-1)" }}>
          Building high-performance autonomous brand ecosystems powered by Agentic AI Agents, GEO strategy, and cinematic AI design.
        </p>
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
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/drew_LAB_COAT_2.png" />
      <div className="slide-content">
        <div className="stagger-1">
          <span className="neo-chip" style={{ fontSize: "10vw" }}>What I Do</span>
        </div>
        <h2 className="stagger-2 font-display" style={{ width: "100%", fontSize: "6vw", textTransform: "uppercase", lineHeight: 0.9 }}>
          <span className="gradient-text">I Build the Future</span>
        </h2>
        <div style={{ display: "grid", width: "50%", margin: "0 auto", gridTemplateColumns: "1fr 1fr", gap: "2vw" }}>
          {pillars.map((p, i) => (
            <div key={p.label} className={`neo-card stagger-${i + 3}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5vw", padding: "3vw", backdropFilter: "blur(4px)", background: "rgba(5,6,10,0.6)" }}>
              <span style={{ fontSize: "8vw" }}>{p.icon}</span>
              <span className="font-display" style={{ fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-0)" }}>{p.label}</span>
              <span className="font-body" style={{ fontSize: "8vw", color: "var(--fg-2)" }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FunFactSlide({ fact }: { fact: { text: string; bgImage: string } }) {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src={fact.bgImage} />
      <div className="slide-content" style={{ gap: "3vw" }}>
        <div className="stagger-1" style={{ fontSize: "10vw" }}>{"\uD83E\uDDD0"}</div>
        <div className="stagger-2">
          <span className="neo-chip" style={{ fontSize: "10vw", borderColor: "rgba(253,184,19,0.5)", color: "#FDB813" }}>Fun Fact</span>
        </div>
        <div className="stagger-3 neo-card" style={{ width: "50%", margin: "0 auto", padding: "4vw", borderRadius: 12, backdropFilter: "blur(4px)", background: "rgba(5,6,10,0.65)" }}>
          <div className="font-body" style={{ fontSize: "7vw", lineHeight: 1.4 }}>
            <Typewriter text={fact.text} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudySlide({ id }: { id: string }) {
  const studies: Record<string, {
    name: string; logo: string; bgImage: string;
    gradient?: string;
    metrics: { value: number; prefix?: string; suffix?: string; label: string }[];
    tagline: string;
  }> = {
    econstruct: {
      name: "eConstruct Inc", logo: "/assets/portfolio/econstruct_logo.png",
      bgImage: "/assets/drew_uber_driver.png",
      gradient: "linear-gradient(to top, #05060a 0%, rgba(5,6,10,0.85) 40%, rgba(5,6,10,0.55) 100%)",
      metrics: [
        { value: 4.2, suffix: "x", label: "GEO Citations", prefix: "" },
        { value: 310, suffix: "%", label: "Organic Traffic", prefix: "+" },
        { value: 1, suffix: "", label: "AI Search Rank", prefix: "#" },
        { value: 3, suffix: "x", label: "Lead Pipeline", prefix: "" },
      ],
      tagline: "GEO-first strategy for High End Residential Construction, Custom AI Lead Management System, AI CEO Dashboard",
    },
    laso: {
      name: "Laso Imaging", logo: "/assets/portfolio/laso.png",
      bgImage: "/assets/drew_uber_driver.png",
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
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src={study.bgImage} gradient={study.gradient} />
      <div className="slide-content" style={{ gap: "2vw" }}>
        <div className="stagger-1"><span className="neo-chip" style={{ fontSize: "10vw" }}>Case Study</span></div>
        <div className="stagger-2" style={{ position: "relative", height: "12vw", width: "36vw", borderRadius: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={study.logo} alt={study.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
        </div>
        <h2 className="stagger-3 font-display" style={{ width: "100%", fontSize: "5vw", textTransform: "uppercase", lineHeight: 0.9 }}>{study.name}</h2>
        <p className="stagger-4 font-tech" style={{ width: "100%", fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent-green)" }}>{study.tagline}</p>
        <div style={{ display: "grid", width: "50%", margin: "0 auto", gridTemplateColumns: "1fr 1fr", gap: "2vw" }}>
          {study.metrics.map((m) => (
            <CountStat key={m.label} value={m.value} prefix={m.prefix} suffix={m.suffix} label={m.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CreativeSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/portfolio/geo_is_ner_seo_image.jpg" gradient="linear-gradient(to top, #05060a 0%, rgba(5,6,10,0.85) 50%, rgba(5,6,10,0.4) 100%)" />
      <div className="slide-content" style={{ gap: "2vw" }}>
        <div className="stagger-1"><span className="neo-chip" style={{ fontSize: "10vw", borderColor: "rgba(168,85,247,0.5)", color: "var(--accent-magenta)" }}>Creative AI</span></div>
        <div className="stagger-2" style={{ position: "relative", width: "50%", margin: "0 auto", overflow: "hidden", borderRadius: 12, border: "1px solid var(--line)", aspectRatio: "16/9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/portfolio/geo_is_ner_seo_image.jpg" alt="GEO Music Video" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
          <div style={{ position: "absolute", bottom: "2vw", left: "3vw", right: "3vw", textAlign: "left" }}>
            <div className="font-display" style={{ fontSize: "6vw", textTransform: "uppercase", letterSpacing: "0.05em" }}>GEO is the New SEO</div>
            <div className="font-tech" style={{ fontSize: "10vw", color: "var(--fg-2)" }}>4K Cinematic AI Music Video</div>
          </div>
        </div>
        <h2 className="stagger-3 font-display" style={{ width: "100%", fontSize: "5vw", textTransform: "uppercase", lineHeight: 0.9 }}>
          Produced in <span style={{ color: "var(--accent-magenta)" }}>1.5 Hours</span> with AI
        </h2>
        <p className="stagger-4 font-body" style={{ width: "100%", fontSize: "12vw", color: "var(--fg-2)" }}>
          At 5% of traditional cost using OpenArt.ai, Suno, ChatGPT &amp; Whisk
        </p>
      </div>
    </div>
  );
}

function HouseRulesSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/portfolio/drew_superhero_rideshare.jpg" />
      <div className="slide-content" style={{ gap: "2vw" }}>
        <div className="stagger-1"><span className="neo-chip" style={{ fontSize: "10vw", borderColor: "rgba(253,184,19,0.5)", color: "#FDB813" }}>Rider Vibes</span></div>
        <h2 className="stagger-2 font-display" style={{ width: "100%", fontSize: "5vw", textTransform: "uppercase", lineHeight: 0.9 }}>
          <span className="gradient-text">House Rules</span>
        </h2>
        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "1.5vw" }}>
          {HOUSE_RULES.map((r, i) => (
            <div key={i} className={`neo-card stagger-${i + 3}`} style={{ display: "flex", alignItems: "center", gap: "2vw", padding: "2vw 3vw", textAlign: "left", backdropFilter: "blur(4px)", background: "rgba(5,6,10,0.6)" }}>
              <span style={{ fontSize: "7vw", flexShrink: 0 }}>{r.icon}</span>
              <span className="font-body" style={{ fontSize: "12vw", color: "var(--fg-1)", lineHeight: 1.3 }}>{r.rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JokeSlide({ joke }: { joke: { setup: string; punchline: string } }) {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/portfolio/drew_kobe_3pointer.jpg" />
      <div className="slide-content">
        <div className="stagger-1" style={{ fontSize: "10vw" }}>{"\uD83D\uDE02"}</div>
        <div className="stagger-2 neo-card font-display" style={{ width: "50%", margin: "0 auto", padding: "4vw", borderRadius: 12, backdropFilter: "blur(4px)", background: "rgba(5,6,10,0.65)", fontSize: "7vw", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          {joke.setup}
        </div>
        <p className="joke-punchline font-display" style={{ width: "100%", fontSize: "9vw", lineHeight: 1.1, color: "#FDB813", textShadow: "0 0 30px rgba(253, 184, 19, 0.4)" }}>
          {joke.punchline}
        </p>
        <div className="stagger-5 font-tech" style={{ width: "100%", fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--fg-2)" }}>
          Your driver is also a comedian (apparently)
        </div>
      </div>
    </div>
  );
}

function ConnectSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/portfolio/Whisk_jdlmthjowy.jpg" />
      <div className="slide-content" style={{ gap: "2vw" }}>
        <div className="stagger-1"><span className="neo-chip" style={{ fontSize: "10vw" }}>Connect</span></div>
        <h2 className="stagger-2 font-display" style={{ width: "100%", fontSize: "5.5vw", textTransform: "uppercase", lineHeight: 0.9 }}>
          <span className="gradient-text">Let&apos;s Build Something</span>
        </h2>
        <div className="stagger-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ height: "32vw", width: "32vw", overflow: "hidden", borderRadius: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/QR-Code.png" alt="QR Code - drewquevedo.com" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <p className="font-tech" style={{ marginTop: "2vw", fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-2)" }}>Scan to visit drewquevedo.com</p>
        </div>
        <div className="stagger-4 font-tech" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2vw", fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-1)" }}>
          <span>@drewquevedo</span>
          <span style={{ color: "var(--line)" }}>|</span>
          <span>dq@drewquevedo.com</span>
        </div>
        <div className="stagger-5 font-tech" style={{ fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-2)" }}>
          LinkedIn &middot; Instagram &middot; YouTube
        </div>
      </div>
    </div>
  );
}

function TipsSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/portfolio/drew_meditate_dark.png" />
      <div className="slide-content" style={{ gap: "2vw" }}>
        <div className="stagger-1" style={{ fontSize: "10vw" }}>{"\uD83D\uDE4F"}</div>
        <h2 className="stagger-2 font-display" style={{ width: "100%", fontSize: "6vw", textTransform: "uppercase", lineHeight: 0.9 }}>
          Tips Are Greatly
          <br />
          <span className="shimmer-gold">Appreciated</span>
        </h2>
        <div className="stagger-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2vw" }}>
          <p className="font-tech" style={{ fontSize: "10vw", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-2)" }}>Cash App</p>
          <div style={{ height: "28vw", width: "28vw", overflow: "hidden", borderRadius: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/Screenshot_20260306_211612_Cash App.jpg" alt="Cash App QR" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
          </div>
          <p className="font-tech" style={{ fontSize: "14vw", color: "var(--accent-green)" }}>$drewq08</p>
        </div>
        <p className="stagger-4 font-body" style={{ width: "100%", fontSize: "12vw", color: "var(--fg-2)" }}>
          Your generosity keeps this ride experience premium. Thank you!
        </p>
      </div>
    </div>
  );
}

function RateSlide() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <SlideBg src="/assets/drew_fam_beach.png" />
      <div className="slide-content">
        <div className="stagger-1"><span className="neo-chip" style={{ fontSize: "10vw" }}>Uber / Lyft Riders</span></div>
        <h2 className="wave-text font-display" style={{ width: "100%", fontSize: "6vw", textTransform: "uppercase", lineHeight: 0.9 }}>
          Thanks for Riding!
        </h2>
        <p className="stagger-3 font-body" style={{ width: "100%", fontSize: "12vw", color: "var(--fg-1)" }}>
          If you enjoyed the experience, a 5-star rating means the world. Have an amazing day!
        </p>
        <div className="stagger-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/web_logo.png" alt="Drew Quevedo" style={{ margin: "0 auto", width: "70vw", height: "auto", opacity: 0.4 }} />
        </div>
      </div>
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
  const [slideKey, setSlideKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setSlideKey((k) => k + 1);
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

  // Wake Lock (harmless if unsupported)
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
      case "houserules": return <HouseRulesSlide />;
      case "joke": return <JokeSlide joke={currentJoke} />;
      case "connect": return <ConnectSlide />;
      case "tips": return <TipsSlide />;
      case "rate": return <RateSlide />;
      default: return null;
    }
  }

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden", background: "var(--bg-0)", color: "#fff" }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes staggerIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes shimmerGold {
          0% { background-position: -200% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes waveIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes punchlineIn {
          from { opacity: 0; transform: scale(0.7) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .slide-active { animation: fadeSlideIn 0.6s ease-out forwards; }
        .slide-content {
          position: relative; z-index: 10; display: flex; height: 100%;
          width: 100%;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 3vw; padding: 0 4vw; text-align: center;
        }
        .stagger-1 { opacity: 0; animation: staggerIn 0.45s ease-out 0.1s forwards; }
        .stagger-2 { opacity: 0; animation: staggerIn 0.45s ease-out 0.18s forwards; }
        .stagger-3 { opacity: 0; animation: staggerIn 0.45s ease-out 0.26s forwards; }
        .stagger-4 { opacity: 0; animation: staggerIn 0.45s ease-out 0.34s forwards; }
        .stagger-5 { opacity: 0; animation: staggerIn 0.45s ease-out 0.42s forwards; }
        .stagger-6 { opacity: 0; animation: staggerIn 0.45s ease-out 0.50s forwards; }
        .stagger-7 { opacity: 0; animation: staggerIn 0.45s ease-out 0.58s forwards; }
        .gradient-text {
          background: linear-gradient(90deg, #7a43e6, #bb8dff, #00D4FF, #7a43e6);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientSweep 3s linear infinite;
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #FDB813, #FFD700, #FDB813);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 2s linear infinite;
        }
        .wave-text {
          opacity: 0;
          animation: waveIn 0.6s ease-out 0.3s forwards;
        }
        .joke-punchline {
          opacity: 0;
          animation: punchlineIn 0.5s ease-out 3s forwards;
        }
      `}</style>

      <div className="pointer-events-none noise-overlay" style={{ position: "fixed", inset: 0, zIndex: 1 }} />
      <div className="pointer-events-none neo-grid" style={{ position: "fixed", inset: 0, zIndex: 1, opacity: 0.3 }} />
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none",
          transition: "all 1s",
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${slide.accent}, transparent)`,
        }}
      />

      <div key={slideKey} className="slide-active" style={{ position: "relative", zIndex: 10, height: "100%", width: "100%" }}>
        {renderSlide()}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, height: 3, background: "rgba(255,255,255,0.05)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))",
            boxShadow: "0 0 8px rgba(122, 67, 230, 0.5)",
          }}
        />
      </div>

      <div style={{ position: "fixed", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", gap: 6 }}>
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            style={{
              borderRadius: "50%",
              transition: "all 0.3s",
              height: 6,
              width: i === current ? 20 : 6,
              background: i === current ? "var(--accent-magenta)" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
