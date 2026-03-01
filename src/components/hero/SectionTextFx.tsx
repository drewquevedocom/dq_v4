"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type SectionTextFxProps = {
  text: string;
  active: boolean;
  className?: string;
  split?: "chars" | "words";
  pulseWords?: string[];
};

const splitLines = (text: string): string[] =>
  text
    .split(":")
    .map((line) => line.trim())
    .filter(Boolean);

export default function SectionTextFx({
  text,
  active,
  className,
  split = "chars",
  pulseWords = [],
}: SectionTextFxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const pulseSetRef = useRef(
    new Set(pulseWords.map((word) => word.toLowerCase())),
  );

  useEffect(() => {
    pulseSetRef.current = new Set(pulseWords.map((word) => word.toLowerCase()));
  }, [pulseWords]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const parts = root.querySelectorAll<HTMLElement>("[data-fx-part]");
    if (!parts.length) {
      return;
    }

    if (!active) {
      gsap.set(parts, {
        opacity: 0,
        y: 26,
        rotateX: -22,
      });
      return;
    }

    if (hasAnimatedRef.current) {
      gsap.to(parts, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      return;
    }

    hasAnimatedRef.current = true;
    gsap.set(parts, {
      opacity: 0,
      y: 30,
      rotateX: -28,
      transformPerspective: 900,
      transformOrigin: "50% 100%",
    });

    gsap.to(parts, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      ease: "power3.out",
      duration: 0.72,
      stagger: split === "chars" ? 0.018 : 0.05,
    });
  }, [active, split]);

  return (
    <div ref={rootRef} className={className}>
      {splitLines(text).map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="block leading-[0.98]">
          {split === "chars"
            ? Array.from(line).map((char, charIndex) => (
                <span
                  key={`${lineIndex}-${charIndex}-${char}`}
                  data-fx-part
                  className="inline-block will-change-transform"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))
            : line.split(" ").map((word, wordIndex) => {
                const normalized = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                const shouldPulse = pulseSetRef.current.has(normalized);

                return (
                  <span
                    key={`${lineIndex}-${wordIndex}-${word}`}
                    data-fx-part
                    className={`inline-block mr-[0.3em] will-change-transform ${
                      shouldPulse ? "title-word-pulse" : ""
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
          {lineIndex < splitLines(text).length - 1 ? ":" : null}
        </span>
      ))}
    </div>
  );
}
