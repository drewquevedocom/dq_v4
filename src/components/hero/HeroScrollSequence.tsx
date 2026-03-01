"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { STAGES } from "./stages";
import StageAsset from "./StageAsset";
import StageText from "./StageText";
import StageOverlay from "./StageOverlay";
import NoiseLayer from "@/components/ui/NoiseLayer";
import OrbitalBlobs from "@/components/ui/OrbitalBlobs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ---------------------------------------------------------------------------
// Helper: adds enter/hold/exit tweens for a single stage to the master
// timeline. Each stage occupies 20% (1/5) of the total scrub distance.
// ---------------------------------------------------------------------------
interface StageRefs {
  asset: HTMLDivElement;
  text: HTMLDivElement;
  overlay?: HTMLDivElement | null;
  bg: HTMLDivElement;
}

function addStageToTimeline(
  tl: gsap.core.Timeline,
  index: number,
  refs: StageRefs,
  total: number = 5
) {
  const size = 1 / total; // 0.2
  const enter = index * size; // 0.0, 0.2, 0.4 …
  const exit = enter + size - 0.04; // 0.16, 0.36 …
  const dur = 0.04;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // --- Asset ---
  if (!isFirst) {
    tl.fromTo(
      refs.asset,
      { opacity: 0, scale: 1.08 },
      { opacity: 1, scale: 1, duration: dur, ease: "power1.out" },
      enter
    );
  }
  if (!isLast) {
    tl.fromTo(
      refs.asset,
      { opacity: 1 },
      { opacity: 0, scale: 1.05, duration: dur, ease: "power1.in" },
      exit
    );
  }

  // --- Text ---
  if (!isFirst) {
    tl.fromTo(
      refs.text,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: dur, ease: "power2.out" },
      enter + 0.01
    );
  }
  if (!isLast) {
    tl.fromTo(
      refs.text,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -40, duration: dur, ease: "power2.in" },
      exit - 0.02
    );
  }

  // --- Overlay ---
  if (refs.overlay) {
    tl.fromTo(
      refs.overlay,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.03, ease: "power1.out" },
      enter + 0.06
    );
    if (!isLast) {
      tl.fromTo(
        refs.overlay,
        { opacity: 1 },
        { opacity: 0, duration: 0.03, ease: "power1.in" },
        exit - 0.01
      );
    }
  }

  // --- Background gradient layer ---
  if (!isFirst) {
    tl.fromTo(
      refs.bg,
      { opacity: 0 },
      { opacity: 1, duration: dur, ease: "none" },
      enter - 0.02
    );
  }
  if (!isLast) {
    tl.fromTo(
      refs.bg,
      { opacity: 1 },
      { opacity: 0, duration: dur, ease: "none" },
      exit + dur
    );
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function HeroScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref arrays – populated via callback refs
  const assetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Orbital blob refs
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Master timeline pinned for 500vh of scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=500vh",
          anticipatePin: 1,
        },
      });

      // Wire up each stage
      STAGES.forEach((stage, i) => {
        const asset = assetRefs.current[i];
        const text = textRefs.current[i];
        const bg = bgRefs.current[i];

        if (!asset || !text || !bg) return;

        addStageToTimeline(tl, i, {
          asset,
          text,
          overlay: overlayRefs.current[i] ?? null,
          bg,
        });
      });

      // Orbital blobs drift across the full timeline
      if (blob1Ref.current) {
        tl.fromTo(
          blob1Ref.current,
          { x: -200, y: -100, backgroundColor: "#4B0082" },
          {
            x: 300,
            y: 200,
            backgroundColor: "#FDB813",
            duration: 1,
            ease: "none",
          },
          0
        );
      }
      if (blob2Ref.current) {
        tl.fromTo(
          blob2Ref.current,
          { x: 250, y: 200, backgroundColor: "#a78bfa" },
          {
            x: -150,
            y: -180,
            backgroundColor: "#4B0082",
            duration: 1,
            ease: "none",
          },
          0
        );
      }
      if (blob3Ref.current) {
        tl.fromTo(
          blob3Ref.current,
          { x: 0, y: 0, backgroundColor: "#8B00FF" },
          {
            x: -100,
            y: 100,
            backgroundColor: "#8b5cf6",
            duration: 1,
            ease: "none",
          },
          0
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* ── Background gradient layers ── */}
      {STAGES.map((stage, i) => (
        <div
          key={`bg-${stage.id}`}
          ref={(el) => {
            bgRefs.current[i] = el;
          }}
          className="absolute inset-0"
          style={{
            background: stage.bgGradient,
            opacity: i === 0 ? 1 : 0,
            willChange: "opacity",
          }}
        />
      ))}

      {/* ── Noise texture ── */}
      <NoiseLayer />

      {/* ── Orbital blobs ── */}
      <OrbitalBlobs
        blob1Ref={blob1Ref}
        blob2Ref={blob2Ref}
        blob3Ref={blob3Ref}
      />

      {/* ── Stage assets (stacked, abs positioned) ── */}
      {STAGES.map((stage, i) => (
        <div
          key={`asset-${stage.id}`}
          ref={(el) => {
            assetRefs.current[i] = el;
          }}
          className="absolute inset-0 z-[3] flex items-center justify-center"
          style={{
            opacity: i === 0 ? 1 : 0,
            willChange: "transform, opacity",
          }}
        >
          <StageAsset
            src={stage.asset}
            type={stage.assetType}
            alt={stage.label}
          />
        </div>
      ))}

      {/* ── Stage text blocks ── */}
      {STAGES.map((stage, i) => (
        <div
          key={`text-${stage.id}`}
          ref={(el) => {
            textRefs.current[i] = el;
          }}
          className="absolute inset-0 z-[4] flex items-end justify-start p-8 pb-24 lg:p-16 lg:pb-32"
          style={{
            opacity: i === 0 ? 1 : 0,
            willChange: "transform, opacity",
          }}
        >
          <StageText label={stage.label} headline={stage.headline} />
        </div>
      ))}

      {/* ── Stage overlays (metrics / blueprint) ── */}
      {STAGES.map((stage, i) =>
        stage.overlayType ? (
          <div
            key={`overlay-${stage.id}`}
            ref={(el) => {
              overlayRefs.current[i] = el;
            }}
            className="absolute right-8 top-24 z-[5] lg:right-16 lg:top-28"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <StageOverlay type={stage.overlayType} />
          </div>
        ) : null
      )}
    </div>
  );
}

