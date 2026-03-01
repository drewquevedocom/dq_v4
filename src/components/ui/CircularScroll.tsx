"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

gsap.registerPlugin(ScrollToPlugin);

type CTAState = "idle" | "playing" | "paused";

export default function CircularScroll() {
  const textRef = useRef<HTMLDivElement>(null);
  const autoScrollTween = useRef<gsap.core.Tween | null>(null);
  const [ctaState, setCtaState] = useState<CTAState>("idle");
  const [flashOn, setFlashOn] = useState(true);

  // Spin ring text
  useEffect(() => {
    if (!textRef.current) return;
    gsap.to(textRef.current, { rotate: 360, duration: 18, repeat: -1, ease: "none" });
  }, []);

  // Flash interval when playing
  useEffect(() => {
    if (ctaState !== "playing") return;
    const id = setInterval(() => setFlashOn((v) => !v), 600);
    return () => clearInterval(id);
  }, [ctaState]);

  // Calculate the true end-scroll position of the hero pinned sequence.
  // The hero section is pinned for 900% of viewport height. We find where
  // the home section starts, then add 900% viewport to get the exact end.
  const getHeroScrollTarget = useCallback((): number => {
    const home = document.getElementById("home");
    if (!home) return 0;
    const homeTop = home.getBoundingClientRect().top + window.scrollY;
    const pinTravel = window.innerHeight * 9; // "+=900%"
    return homeTop + pinTravel;
  }, []);

  const startAutoScroll = useCallback(() => {
    setCtaState("playing");
    trackEvent("cinematic_scroll_play", {});
    autoScrollTween.current?.kill();

    const target = getHeroScrollTarget();
    const distanceRemaining = target - window.scrollY;
    // Pace: ~90px per second so transition stages are visibly cinematic
    const duration = Math.max(8, distanceRemaining / 90);

    autoScrollTween.current = gsap.to(window, {
      duration,
      scrollTo: { y: target, autoKill: false },
      ease: "none",
      onComplete: () => {
        setCtaState("paused");
        trackEvent("cinematic_scroll_complete", {});
      },
    });
  }, [getHeroScrollTarget]);

  const stopAutoScroll = useCallback(() => {
    autoScrollTween.current?.pause();
    setCtaState("paused");
    trackEvent("cinematic_scroll_pause", {});
  }, []);

  const resumeAutoScroll = useCallback(() => {
    if (autoScrollTween.current && autoScrollTween.current.paused()) {
      autoScrollTween.current.resume();
      setCtaState("playing");
    } else {
      startAutoScroll();
    }
    trackEvent("cinematic_scroll_resume", {});
  }, [startAutoScroll]);

  const handleClick = () => {
    if (ctaState === "idle") startAutoScroll();
    else if (ctaState === "playing") stopAutoScroll();
    else resumeAutoScroll();
  };

  const ringLabel =
    ctaState === "idle"
      ? "Scroll To Explore - Scroll To Explore -"
      : ctaState === "playing"
        ? "● Playing  Tap To Stop ● Playing  Tap To Stop"
        : "▶ Play To Continue ▶ Play To Continue ▶ ";

  const ringColor =
    ctaState === "playing" ? "fill-[#D1C4E9]" : ctaState === "paused" ? "fill-[#9B7FD8]" : "fill-white/40";

  return (
    <div className="fixed bottom-20 right-5 z-40 flex items-center justify-center md:bottom-24 md:right-6">
      <div className="relative h-28 w-28 md:h-32 md:w-32">

        {/* Spinning ring label */}
        <motion.div
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
          animate={{ opacity: ctaState === "playing" && !flashOn ? 0.3 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
            <text className={`text-[8px] uppercase tracking-[0.25em] font-tech ${ringColor}`}>
              <textPath xlinkHref="#circlePath">{ringLabel}</textPath>
            </text>
          </svg>
        </motion.div>

        {/* Single large center button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            type="button"
            onClick={handleClick}
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/24 bg-black/50 text-white/80 backdrop-blur-sm"
            whileHover={{ scale: 1.08, borderColor: "rgba(155,127,216,0.7)" }}
            whileTap={{ scale: 0.92 }}
            animate={
              ctaState === "paused"
                ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(155,127,216,0)", "0 0 22px rgba(155,127,216,0.7)", "0 0 0px rgba(155,127,216,0)"] }
                : ctaState === "idle"
                  ? { y: [0, -3, 0] }
                  : { borderColor: flashOn ? "rgba(209,196,233,0.9)" : "rgba(255,255,255,0.15)" }
            }
            transition={
              ctaState === "paused"
                ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                : ctaState === "idle"
                  ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.1 }
            }
            aria-label={ctaState === "idle" ? "Start cinematic scroll" : ctaState === "playing" ? "Pause cinematic scroll" : "Resume cinematic scroll"}
          >
            <AnimatePresence mode="wait">
              {ctaState === "idle" && (
                <motion.span key="idle" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                  {/* Down chevron */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.span>
              )}
              {ctaState === "playing" && (
                <motion.span key="playing" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                  <Square size={22} className={flashOn ? "text-[#D1C4E9]" : "text-white/30"} fill={flashOn ? "#D1C4E9" : "transparent"} />
                </motion.span>
              )}
              {ctaState === "paused" && (
                <motion.span key="paused" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                  <Play size={24} className="text-[#9B7FD8] translate-x-0.5" fill="#9B7FD8" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
