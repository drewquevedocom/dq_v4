"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GeoBlock from "./GeoBlock";
import SectionTextFx from "./SectionTextFx";
import { STAGES } from "./stages";
import { trackEvent } from "@/lib/analytics";
import MatrixTextReveal from "../MatrixTextReveal";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;
const IMAGE_BASE_PATH = "/assets/stages/slide_1/ezgif-frame-";
const IMAGE_BASE_PATH_2 = "/assets/stages/slide_2/ezgif-frame-";
const IMAGE_BASE_PATH_3 = "/assets/stages/slide_3/ezgif-frame-";
const IMAGE_BASE_PATH_4 = "/assets/stages/slide_4/ezgif-frame-";

const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value));

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPulseWordsForStage = (stageId: string): string[] => {
  switch (stageId) {
    case "zen-architect":
      return ["breathe"];
    case "the-researcher":
      return ["authority"];
    case "the-builder":
      return ["systems"];
    case "creative-ai":
      return ["seo"];
    case "the-human":
      return ["integration"];
    default:
      return [];
  }
};

const highlightKeywords = (text: string, keywords: string[] | undefined) => {
  if (!keywords || keywords.length === 0) {
    return text;
  }

  const keywordSet = new Set(keywords.map((keyword) => keyword.toLowerCase()));
  const pattern = new RegExp(`\\b(${keywords.map(escapeRegExp).join("|")})\\b`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isKeyword = keywordSet.has(part.toLowerCase());
    if (!isKeyword) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <span
        key={`${part}-${index}`}
        className="font-semibold text-[#D1C4E9] [text-shadow:0_0_15px_rgba(209,196,233,0.5)]"
      >
        {part}
      </span>
    );
  });
};

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);
  const canvas4Ref = useRef<HTMLCanvasElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  const video4Ref = useRef<HTMLVideoElement>(null);
  const video5Ref = useRef<HTMLVideoElement>(null);
  const stagesRef = useRef<(HTMLElement | null)[]>([]);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [images2, setImages2] = useState<HTMLImageElement[]>([]);
  const [images3, setImages3] = useState<HTMLImageElement[]>([]);
  const [images4, setImages4] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGeoSignal, setShowGeoSignal] = useState(false);
  const activeStageRef = useRef(0);

  useEffect(() => {
    const mediaMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mediaMobile = window.matchMedia("(max-width: 900px)");

    const handleChange = () => {
      setIsReducedMotion(mediaMotion.matches);
      setIsMobile(mediaMobile.matches);
    };

    handleChange();
    mediaMotion.addEventListener("change", handleChange);
    mediaMobile.addEventListener("change", handleChange);

    // Refresh ScrollTrigger after resize so the pinned hero re-anchors
    // correctly when switching between mobile/desktop viewport sizes.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      mediaMotion.removeEventListener("change", handleChange);
      mediaMobile.removeEventListener("change", handleChange);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const total = FRAME_COUNT * 4;
    let done = false;

    const finish = () => {
      if (!done) {
        done = true;
        setIsLoaded(true);
      }
    };

    const onLoad = () => {
      loadedCount += 1;
      if (loadedCount >= total) {
        finish();
      }
    };

    const loadSet = (basePath: string): HTMLImageElement[] => {
      const loaded: HTMLImageElement[] = [];
      for (let i = 1; i <= FRAME_COUNT; i += 1) {
        const img = new Image();
        img.src = `${basePath}${i.toString().padStart(3, "0")}.jpg`;
        img.onload = onLoad;
        img.onerror = onLoad; // If missing, just count it so loader finishes
        loaded.push(img);
      }
      return loaded;
    };

    setImages(loadSet(IMAGE_BASE_PATH));
    setImages2(loadSet(IMAGE_BASE_PATH_2));
    setImages3(loadSet(IMAGE_BASE_PATH_3));
    setImages4(loadSet(IMAGE_BASE_PATH_4));

    // Safety net: on slow mobile networks force-show after 4 seconds
    const timer = window.setTimeout(finish, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      if (
        !isLoaded ||
        !canvasRef.current ||
        !canvas2Ref.current ||
        !canvas3Ref.current ||
        !canvas4Ref.current ||
        !containerRef.current
      ) {
        return;
      }

      const canvas = canvasRef.current;
      const canvas2 = canvas2Ref.current;
      const canvas3 = canvas3Ref.current;
      const canvas4 = canvas4Ref.current;
      const context = canvas.getContext("2d");
      const context2 = canvas2.getContext("2d");
      const context3 = canvas3.getContext("2d");
      const context4 = canvas4.getContext("2d");

      if (!context || !context2 || !context3 || !context4) {
        return;
      }

      const sequenceObj = { frame: 0 };
      const sequenceObj2 = { frame: 0 };
      const sequenceObj3 = { frame: 0 };
      const sequenceObj4 = { frame: 0 };

      const renderCover = (
        ctx: CanvasRenderingContext2D,
        cvs: HTMLCanvasElement,
        img: HTMLImageElement,
      ) => {
        if (!img.complete || img.naturalWidth === 0) return;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const imgRatio = img.width / img.height;
        const canvasRatio = cvs.width / cvs.height;

        let drawWidth: number;
        let drawHeight: number;
        let offsetX: number;
        let offsetY: number;

        if (canvasRatio > imgRatio) {
          drawWidth = cvs.width;
          drawHeight = cvs.width / imgRatio;
          offsetX = 0;
          offsetY = (cvs.height - drawHeight) / 2;
        } else {
          drawWidth = cvs.height * imgRatio;
          drawHeight = cvs.height;
          offsetX = (cvs.width - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };

      const render = (index: number) => images[index] && renderCover(context, canvas, images[index]);
      const render2 = (index: number) =>
        images2[index] && renderCover(context2, canvas2, images2[index]);
      const render3 = (index: number) =>
        images3[index] && renderCover(context3, canvas3, images3[index]);
      const render4 = (index: number) =>
        images4[index] && renderCover(context4, canvas4, images4[index]);

      render(0);
      render2(0);
      render3(0);
      render4(0);

      const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas2.width = window.innerWidth;
        canvas2.height = window.innerHeight;
        canvas3.width = window.innerWidth;
        canvas3.height = window.innerHeight;
        canvas4.width = window.innerWidth;
        canvas4.height = window.innerHeight;
        render(Math.round(sequenceObj.frame));
        render2(Math.round(sequenceObj2.frame));
        render3(Math.round(sequenceObj3.frame));
        render4(Math.round(sequenceObj4.frame));
      };

      window.addEventListener("resize", updateCanvasSize);
      updateCanvasSize();

      // On mobile, let GSAP own touch-scroll so the pinned sequence
      // responds to swipe gestures correctly.
      if (isMobile) {
        ScrollTrigger.normalizeScroll(true);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=900%",
          pin: true,
          scrub: isReducedMotion || isMobile ? 0.3 : 1,
          snap: isReducedMotion || isMobile
            ? undefined
            : {
              snapTo: 1 / (STAGES.length - 1),
              duration: { min: 0.1, max: 0.35 },
              delay: 0.05,
              ease: "power1.inOut",
            },
          onUpdate: (self) => {
            const progress = self.progress;
            const stageIndex = Math.min(
              Math.floor(progress * STAGES.length),
              STAGES.length - 1,
            );

            if (stageIndex !== activeStageRef.current) {
              activeStageRef.current = stageIndex;
              setActiveStage(stageIndex);
            }

            const segment = 1 / STAGES.length;
            for (let i = 0; i < STAGES.length; i += 1) {
              const local = clamp((progress - i * segment) / segment);
              const parallax = isReducedMotion ? 0 : 0.5 - local;
              if (stagesRef.current[i]) {
                gsap.set(stagesRef.current[i], {
                  "--stage-parallax": parallax,
                } as gsap.TweenVars);
              }
            }
          },
        },
      });

      STAGES.forEach((_, index) => {
        if (index > 0) {
          gsap.set(stagesRef.current[index], { opacity: 0, y: 44 });
        }
      });

      tl.to(stagesRef.current[0], { opacity: 0, y: -40, duration: 0.1 }, 0.18)
        .to(stagesRef.current[1], { opacity: 1, y: 0, duration: 0.12 }, 0.22)
        .to(canvasRef.current, { opacity: 1, duration: 0.12 }, 0.22)
        .to(video1Ref.current, { opacity: 0, duration: 0.01 }, 0.22)
        .to(
          sequenceObj,
          {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            duration: 0.14,
            onUpdate: () => render(Math.round(sequenceObj.frame)),
          },
          0.22,
        )
        .to(video2Ref.current, { opacity: 1, duration: 0.1 }, 0.36)
        .to(canvasRef.current, { opacity: 0, duration: 0.01 }, 0.37)
        .to({}, { duration: 0.18 }, 0.38)
        .to(stagesRef.current[1], { opacity: 0, y: -40, duration: 0.1 }, 0.56)
        .to(stagesRef.current[2], { opacity: 1, y: 0, duration: 0.12 }, 0.6)
        .to(canvas2Ref.current, { opacity: 1, duration: 0.1 }, 0.6)
        .to(
          sequenceObj2,
          {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            duration: 0.14,
            onUpdate: () => render2(Math.round(sequenceObj2.frame)),
          },
          0.6,
        )
        .to(video2Ref.current, { opacity: 0, duration: 0.01 }, 0.74)
        .to(video3Ref.current, { opacity: 1, duration: 0.1 }, 0.75)
        .to(canvas2Ref.current, { opacity: 0, duration: 0.01 }, 0.76)
        .to({}, { duration: 0.18 }, 0.77)
        .to(stagesRef.current[2], { opacity: 0, y: -40, duration: 0.1 }, 0.95)
        .to(stagesRef.current[3], { opacity: 1, y: 0, duration: 0.12 }, 1.0)
        .to(canvas3Ref.current, { opacity: 1, duration: 0.1 }, 1.0)
        .to(
          sequenceObj3,
          {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            duration: 0.13,
            onUpdate: () => render3(Math.round(sequenceObj3.frame)),
          },
          1.0,
        )
        .to(video3Ref.current, { opacity: 0, duration: 0.01 }, 1.13)
        .to(video4Ref.current, { opacity: 1, duration: 0.1 }, 1.14)
        .to(canvas3Ref.current, { opacity: 0, duration: 0.01 }, 1.15)
        .to({}, { duration: 0.2 }, 1.16)
        .to(stagesRef.current[3], { opacity: 0, y: -40, duration: 0.1 }, 1.36)
        .to(stagesRef.current[4], { opacity: 1, y: 0, duration: 0.12 }, 1.42)
        .to(canvas4Ref.current, { opacity: 1, duration: 0.1 }, 1.42)
        .to(
          sequenceObj4,
          {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            duration: 0.13,
            onUpdate: () => render4(Math.round(sequenceObj4.frame)),
          },
          1.42,
        )
        .to(video4Ref.current, { opacity: 0, duration: 0.01 }, 1.55)
        .to(video5Ref.current, { opacity: 1, duration: 0.1 }, 1.56)
        .to(canvas4Ref.current, { opacity: 0, duration: 0.01 }, 1.57);

      return () => {
        window.removeEventListener("resize", updateCanvasSize);
      };
    },
    { dependencies: [isLoaded, images, images2, images3, images4, isReducedMotion, isMobile] },
  );

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* JSON-LD Strategy/FAQ Schema for AISEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: STAGES.map((s) => ({
              "@type": "Question",
              name: s.headline,
              acceptedAnswer: {
                "@type": "Answer",
                text: s.directAnswer,
              },
            })),
          }),
        }}
      />
      {!isLoaded ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : null}

      <div className="absolute inset-0 z-0">
        <video
          ref={video1Ref}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-[50%_65%] md:object-[50%_46%]"
        >
          <source src={STAGES[0].asset} type="video/mp4" />
        </video>
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0" />
        <video ref={video2Ref} autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_60%] md:object-[50%_50%] opacity-0">
          <source src={STAGES[1].asset} type="video/mp4" />
        </video>
        <canvas ref={canvas2Ref} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0" />
        <video ref={video3Ref} autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_60%] md:object-[50%_50%] opacity-0">
          <source src={STAGES[2].asset} type="video/mp4" />
        </video>
        <canvas ref={canvas3Ref} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0" />
        <video ref={video4Ref} autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_60%] md:object-[50%_50%] opacity-0">
          <source src={STAGES[3].asset} type="video/mp4" />
        </video>
        <canvas ref={canvas4Ref} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0" />
        <video ref={video5Ref} autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_60%] md:object-[50%_50%] opacity-0">
          <source src={STAGES[4].asset} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/22 to-transparent" />
      </div>

      <div className="relative z-10 h-full w-full">
        {STAGES.map((stage, index) => (
          <article
            key={stage.id}
            ref={(element) => {
              stagesRef.current[index] = element;
            }}
            className={`absolute inset-0 flex flex-col items-center px-4 pb-6 sm:pb-8 md:pb-10 text-center ${index === 0
              ? "pt-[15vh] sm:pt-[18vh] md:pt-[18vh] lg:pt-[16vh]"
              : "pt-[15vh] sm:pt-[18vh] md:pt-[18vh] lg:pt-[16vh]"
              } ${index === 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            style={
              {
                pointerEvents: activeStage === index ? "auto" : "none",
              } as CSSProperties
            }
          >
            {!isReducedMotion && activeStage === index ? <div className="section-scan top-[32%]" /> : null}

            {index === 0 ? (
              <h1
                className="mb-8 md:mb-16 max-w-[1200px] xl:max-w-[1400px] w-full font-tech text-[clamp(1.3rem,8vw,5.7rem)] uppercase leading-[0.9] tracking-normal md:tracking-normal text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(155, 127, 216, 0.4)" }}
              >
                <div className="inline-block">
                  <MatrixTextReveal
                    text={stage.headline}
                    isActive={activeStage === index}
                    duration={1.5}
                  >
                    <span>
                      {stage.headline.split("Breathe").map((part, i) =>
                        i === 0 ? (
                          <span key={i}>{part}</span>
                        ) : (
                          <motion.span
                            key={i}
                            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-block origin-center"
                          >
                            Breathe{part}
                          </motion.span>
                        )
                      )}
                    </span>
                  </MatrixTextReveal>
                </div>
              </h1>
            ) : (
              <SectionTextFx
                text={stage.headline}
                active={activeStage === index}
                split="words"
                pulseWords={getPulseWordsForStage(stage.id)}
                className="mb-8 md:mb-16 max-w-[1200px] xl:max-w-[1400px] w-full font-tech text-[clamp(1.3rem,8vw,5.7rem)] uppercase leading-[0.9] tracking-normal md:tracking-normal text-white [text-shadow:0px_4px_12px_rgba(0,0,0,0.8)]"
              />
            )}

            <div className="mt-auto flex w-full flex-col items-center">
              <div
                className="max-w-3xl rounded-2xl border border-white/10 bg-[#4B0082]/15 px-3 py-2 text-balance font-tech text-[0.72rem] sm:text-[0.85rem] leading-snug text-white backdrop-blur-md [text-shadow:0px_4px_12px_rgba(0,0,0,0.8)] md:px-6 md:py-5 md:text-[1.02rem]"
                style={{
                  transform: `translate3d(0, calc(var(--stage-parallax, 0) * 14px), 0)`,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,1))"
                }}
              >
                <MatrixTextReveal
                  text={stage.subHeadline}
                  isActive={activeStage === index}
                >
                  <p>
                    {highlightKeywords(stage.subHeadline, stage.keywords)}
                  </p>
                </MatrixTextReveal>
              </div>

              <div
                className="mt-4 md:mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-4"
                style={{
                  transform: `translate3d(0, calc(var(--stage-parallax, 0) * 18px), 0)`,
                }}
              >
                <Link
                  href="/contact"
                  className="btn-primary"
                  onClick={() =>
                    trackEvent("cta_contact_click", {
                      source: "hero_stage",
                      stage: stage.id,
                    })
                  }
                >
                  Contact
                </Link>
                <Link
                  href="/book-strategy"
                  className="btn-secondary"
                  onClick={() =>
                    trackEvent("cta_book_strategy_click", {
                      source: "hero_stage",
                      stage: stage.id,
                    })
                  }
                >
                  Book Strategy
                </Link>
                {stage.primaryCTA.label !== 'Initialize' && (
                  <Link
                    href={stage.primaryCTA.href}
                    className="btn-secondary"
                    onClick={() =>
                      trackEvent("cta_stage_primary_click", {
                        stage: stage.id,
                        href: stage.primaryCTA.href,
                      })
                    }
                  >
                    {stage.primaryCTA.label}
                  </Link>
                )}
              </div>

              <Link
                href={stage.subLink.href}
                target={stage.subLink.href.startsWith("http") ? "_blank" : undefined}
                rel={stage.subLink.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={() =>
                  trackEvent("cta_stage_sub_link_click", {
                    stage: stage.id,
                    href: stage.subLink.href,
                  })
                }
                className="mt-4 font-tech text-[0.6rem] uppercase tracking-widest text-[var(--fg-2)] transition-colors hover:text-[var(--fg-1)]"
              >
                {stage.subLink.label}
              </Link>

              <button
                type="button"
                onClick={() => setShowGeoSignal((current) => !current)}
                className="mt-3 rounded-full border border-white/20 bg-black/45 px-4 py-1.5 font-tech text-[0.58rem] uppercase tracking-widest text-white/80 transition hover:border-white/35 hover:text-white"
              >
                {showGeoSignal ? "Hide GEO Signal" : "Show GEO Signal"}
              </button>

              <GeoBlock
                content={stage.directAnswer}
                isVisible={activeStage === index && showGeoSignal}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
