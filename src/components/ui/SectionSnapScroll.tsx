"use client";

import { useEffect, useRef } from "react";

const SECTION_IDS = ["home", "capabilities", "portfolio", "contact"];

const canInterceptTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return true;
  }

  const blockTags = new Set(["INPUT", "TEXTAREA", "SELECT", "OPTION", "BUTTON"]);
  if (blockTags.has(target.tagName)) {
    return false;
  }

  return !target.closest("[data-no-snap-scroll='true']");
};

const getVisibleSectionIndex = (): number => {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  const anchor = window.innerHeight * 0.22;

  SECTION_IDS.forEach((id, index) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    const distance = Math.abs(section.getBoundingClientRect().top - anchor);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
};

export default function SectionSnapScroll() {
  const lockRef = useRef(false);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!canInterceptTarget(event.target) || lockRef.current) {
        return;
      }

      const delta = event.deltaY;
      if (Math.abs(delta) < 10) {
        return;
      }

      const current = getVisibleSectionIndex();
      const nextIndex =
        delta > 0
          ? Math.min(SECTION_IDS.length - 1, current + 1)
          : Math.max(0, current - 1);

      if (nextIndex === current) {
        return;
      }

      const nextSection = document.getElementById(SECTION_IDS[nextIndex]);
      if (!nextSection) {
        return;
      }

      event.preventDefault();
      lockRef.current = true;
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        lockRef.current = false;
      }, 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return null;
}
