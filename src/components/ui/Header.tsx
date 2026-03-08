"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type NavItem = {
  label: string;
  href: string;
  sectionId?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/#home", sectionId: "home" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const getActiveSection = (sectionIds: string[]): string => {
  let active = sectionIds[0] ?? "home";
  let closest = Number.POSITIVE_INFINITY;

  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (!section) continue;
    const distance = Math.abs(section.getBoundingClientRect().top - 140);
    if (distance < closest) {
      closest = distance;
      active = id;
    }
  }

  return active;
};

export default function Header() {
  const [activeId, setActiveId] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isSubpage = pathname !== "/";
  const hasBackground = isSubpage || activeId !== "home";

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.sectionId).filter(
      (value): value is string => Boolean(value),
    );

    const onScroll = () => setActiveId(getActiveSection(sectionIds));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-10 md:py-6 transition-all duration-300 ${hasBackground ? "bg-[rgba(6,6,18,0.95)] backdrop-blur-md shadow-lg shadow-black/40" : ""}`}>
        <div className="mx-auto w-full max-w-[1520px] rounded-2xl bg-transparent px-3 py-2 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/#home" className="relative h-[78px] w-[255px] md:h-[99px] md:w-[357px]">
              <Image
                src="/assets/web_logo.png"
                alt="Drew Quevedo Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-2 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = item.sectionId ? item.sectionId === activeId : false;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => trackEvent("nav_click", { target: item.sectionId ?? item.href })}
                    className="group relative px-3 py-1.5 font-tech text-[0.66rem] font-semibold uppercase tracking-widest text-white drop-shadow-md transition-all hover:text-white"
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-2 -bottom-0.5 h-[2px] origin-center rounded-full bg-[var(--accent-magenta)] transition-transform duration-200 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Contact CTA */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center justify-center rounded-full border border-[rgba(168,85,247,0.6)] bg-[rgba(122,67,230,0.24)] px-6 py-2.5 font-tech text-[0.66rem] font-semibold uppercase tracking-widest text-white drop-shadow-md transition hover:bg-[rgba(122,67,230,0.36)]"
                onClick={() => trackEvent("cta_contact_click", { source: "header" })}
              >
                Contact
              </Link>

              {/* Mobile hamburger button */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-[rgba(168,85,247,0.5)] hover:bg-[rgba(122,67,230,0.2)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <X size={18} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <Menu size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
            />

            {/* Slide-in panel */}
            <motion.nav
              key="panel"
              className="fixed right-0 top-0 z-50 flex h-full w-[78vw] max-w-[320px] flex-col bg-[#060612] border-l border-white/10 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-6">
                <span className="font-tech text-[0.6rem] uppercase tracking-[0.3em] text-white/40">Navigation</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[rgba(155,127,216,0.4)] to-transparent" />

              {/* Nav links */}
              <div className="flex flex-col gap-1 px-4 py-6">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = item.sectionId ? item.sectionId === activeId : false;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          trackEvent("nav_click", { target: item.sectionId ?? item.href, source: "mobile_menu" });
                          closeMenu();
                        }}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 font-tech text-sm font-semibold uppercase tracking-widest transition ${isActive
                          ? "bg-[rgba(155,127,216,0.15)] text-[#D1C4E9]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-magenta)] flex-shrink-0" />
                        )}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA at bottom */}
              <div className="mt-auto px-6 pb-10">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                <Link
                  href="/contact"
                  onClick={() => {
                    trackEvent("cta_contact_click", { source: "mobile_menu" });
                    closeMenu();
                  }}
                  className="flex w-full items-center justify-center rounded-full border border-[rgba(168,85,247,0.6)] bg-[rgba(122,67,230,0.24)] py-3.5 font-tech text-[0.72rem] font-semibold uppercase tracking-widest text-white transition hover:bg-[rgba(122,67,230,0.4)]"
                >
                  Contact
                </Link>
                <Link
                  href="/book-strategy"
                  onClick={closeMenu}
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-white/15 py-3 font-tech text-[0.68rem] uppercase tracking-widest text-white/60 transition hover:text-white"
                >
                  Book Strategy
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
