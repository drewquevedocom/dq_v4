"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Disable Lenis smooth-scrolling on touch/mobile devices —
        // native momentum scrolling performs better and avoids GSAP pin conflicts.
        const isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            // On mobile: just make sure ScrollTrigger uses native scroll
            ScrollTrigger.config({ ignoreMobileResize: true });
            return;
        }

        const lenis = new Lenis({
            lerp: 0.05,
            wheelMultiplier: 0.7,
            smoothWheel: true,
        });

        // Wire Lenis into GSAP ticker as the scroll proxy so ScrollTrigger
        // reads Lenis's virtual scroll position rather than window.scrollY.
        ScrollTrigger.scrollerProxy(document.documentElement, {
            scrollTop(value) {
                if (arguments.length && value !== undefined) {
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            pinType: document.documentElement.style.transform ? "transform" : "fixed",
        });

        lenis.on("scroll", ScrollTrigger.update);

        const tickerFn = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerFn);
            lenis.destroy();
            ScrollTrigger.scrollerProxy(document.documentElement, undefined as never);
            ScrollTrigger.refresh();
        };
    }, []);

    return <>{children}</>;
}
