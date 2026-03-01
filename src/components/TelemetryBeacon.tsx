"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const SECTION_IDS = ["home", "capabilities", "contact"] as const;
const DEPTH_MARKS = [25, 50, 75, 100] as const;

export default function TelemetryBeacon() {
  useEffect(() => {
    const seenSections = new Set<string>();
    const seenDepth = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("id");
          if (!id || !entry.isIntersecting || seenSections.has(id)) {
            continue;
          }

          seenSections.add(id);
          trackEvent("landing_section_view", { section: id });
        }
      },
      { threshold: 0.45 },
    );

    for (const id of SECTION_IDS) {
      const node = document.getElementById(id);
      if (node) {
        observer.observe(node);
      }
    }

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight <= 0 ? 100 : Math.round((scrollTop / docHeight) * 100);

      for (const mark of DEPTH_MARKS) {
        if (depth >= mark && !seenDepth.has(mark)) {
          seenDepth.add(mark);
          trackEvent("landing_scroll_depth", { depth_percent: mark });
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
