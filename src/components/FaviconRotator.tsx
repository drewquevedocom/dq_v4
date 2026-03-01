"use client";

import { useEffect } from "react";

const FAVICON_SEQUENCE = [
  "/favicons/ai-chip.svg",
  "/favicons/family.svg",
  "/favicons/meditation.svg",
];

const TRANSITION_ICON = "/favicons/transition-glow.svg";
const ROTATE_MS = 15000;
const TRANSITION_MS = 420;

const setFaviconHref = (href: string) => {
  if (typeof document === "undefined") {
    return;
  }

  const cacheBusted = `${href}?v=${Date.now()}`;
  const head = document.head;
  const rels = ["icon", "shortcut icon"];

  rels.forEach((rel) => {
    let link = head.querySelector<HTMLLinkElement>(`link[rel='${rel}'][data-dynamic='true']`);

    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      link.type = "image/svg+xml";
      link.setAttribute("data-dynamic", "true");
      head.appendChild(link);
    }

    link.href = cacheBusted;
  });
};

export default function FaviconRotator() {
  useEffect(() => {
    let index = 0;
    let transitionTimer: ReturnType<typeof setTimeout> | null = null;

    setFaviconHref(FAVICON_SEQUENCE[index]);

    const interval = setInterval(() => {
      setFaviconHref(TRANSITION_ICON);
      transitionTimer = setTimeout(() => {
        index = (index + 1) % FAVICON_SEQUENCE.length;
        setFaviconHref(FAVICON_SEQUENCE[index]);
      }, TRANSITION_MS);
    }, ROTATE_MS);

    return () => {
      clearInterval(interval);
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
    };
  }, []);

  return null;
}
