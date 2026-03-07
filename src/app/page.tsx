"use client";

import Link from "next/link";
import Header from "@/components/ui/Header";
import CircularScroll from "@/components/ui/CircularScroll";
import SocialLinks from "@/components/ui/SocialLinks";
import BackToTop from "@/components/ui/BackToTop";
import NoiseLayer from "@/components/ui/NoiseLayer";
import ScrollSequence from "@/components/hero/ScrollSequence";
import Capabilities from "@/components/ui/Capabilities";
import PortfolioTeaser from "@/components/portfolio/PortfolioTeaser";
import TelemetryBeacon from "@/components/TelemetryBeacon";
import SectionTitle from "@/components/ui/SectionTitle";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import RecentInsights from "@/components/ui/RecentInsights";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <TelemetryBeacon />
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid" />
      <Header />

      <section id="home" className="relative z-10 min-h-screen snap-start">
        <ScrollSequence />
      </section>

      <Capabilities />

      <PortfolioTeaser />

      <RecentInsights />

      <section
        id="contact"
        className="relative z-10 snap-start border-t border-white/10 bg-black/70 px-4 pb-16 pt-20 md:px-8 md:pt-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start">
            <SectionTitle
              title="Together"
              pulseWord="Together"
              titleClassName="text-[18vw] md:text-[8.2rem]"
              className="md:pt-4"
            />
            <div className="max-w-md md:justify-self-end">
              <p className="font-tech text-[0.66rem] uppercase tracking-widest text-white/60">
                Contact
              </p>
              <SectionSubtitle
                text="Feeling good about a new project? Write what is in your mind and let's talk about it."
                keywords={['project', 'talk']}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="btn-primary"
                  onClick={() => trackEvent("cta_contact_click", { source: "footer_together" })}
                >
                  Contact
                </Link>
                <Link
                  href="/book-strategy"
                  className="btn-secondary"
                  onClick={() =>
                    trackEvent("cta_book_strategy_click", { source: "footer_together" })
                  }
                >
                  Book Strategy
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <SocialLinks />
      <CircularScroll />
      <BackToTop />
    </div>
  );
}
