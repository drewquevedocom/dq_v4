"use client";

import Link from "next/link";
import Header from "@/components/ui/Header";
import CircularScroll from "@/components/ui/CircularScroll";
import SocialLinks from "@/components/ui/SocialLinks";
import NoiseLayer from "@/components/ui/NoiseLayer";
import ScrollSequence from "@/components/hero/ScrollSequence";
import Capabilities from "@/components/ui/Capabilities";
import PortfolioTeaser from "@/components/portfolio/PortfolioTeaser";
import TelemetryBeacon from "@/components/TelemetryBeacon";
import SectionTitle from "@/components/ui/SectionTitle";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import { trackEvent } from "@/lib/analytics";
import { Globe, Instagram, Linkedin, Youtube } from "lucide-react";

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

          <div className="my-10 border-t border-white/10" />

          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-display text-4xl uppercase tracking-tight text-white">Links</h3>
              <ul className="mt-4 space-y-2 font-body text-sm text-white/80">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/book-strategy" className="hover:text-white">
                    Book Strategy
                  </Link>
                </li>
                <li>
                  <Link href="/book-strategy" className="hover:text-white">
                    Terms Of Use
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-4xl uppercase tracking-tight text-white">Sitemap</h3>
              <ul className="mt-4 space-y-2 font-body text-sm text-white/80">
                <li>
                  <Link href="/#home" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#capabilities" className="hover:text-white">
                    Capabilities
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-white">
                    My Work
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-4xl uppercase tracking-tight text-white">Contact</h3>
              <div className="mt-4 space-y-2 font-body text-sm text-white/80">
                <p>Drew Quevedo</p>
                <p>Remote, United States</p>
                <p>hello@drewquevedo.com</p>
                <p>+1 (555) 000-0000</p>
              </div>
              <div className="mt-5 flex items-center gap-3 text-white/80">
                <a
                  href="https://drewquevedo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  aria-label="Website"
                >
                  <Globe size={17} />
                </a>
                <a
                  href="https://www.linkedin.com/in/drewquevedo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={17} />
                </a>
                <a
                  href="https://www.instagram.com/drewquevedo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="https://www.youtube.com/@drewquevedo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  aria-label="YouTube"
                >
                  <Youtube size={17} />
                </a>
              </div>
            </div>

            <div className="md:justify-self-end">
              <div className="font-display text-6xl uppercase tracking-tight text-white">DQ</div>
              <p className="mt-5 font-body text-sm text-white/55">
                © 2026 DREWQUEVEDO.COM
                <br />
                All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </section>

      <SocialLinks />
      <CircularScroll />
    </div>
  );
}
