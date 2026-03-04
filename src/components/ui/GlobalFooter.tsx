"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Instagram, Linkedin, Youtube } from "lucide-react";

export default function GlobalFooter() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/70 px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="font-display text-4xl uppercase tracking-tight text-white">Links</h3>
                        <ul className="mt-4 space-y-2 font-body text-sm text-white/80">
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/book-strategy" className="hover:text-white transition-colors">
                                    Book Strategy
                                </Link>
                            </li>
                            <li>
                                <Link href="/book-strategy" className="hover:text-white transition-colors">
                                    Terms Of Use
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-display text-4xl uppercase tracking-tight text-white">Sitemap</h3>
                        <ul className="mt-4 space-y-2 font-body text-sm text-white/80">
                            <li>
                                <Link href="/#home" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/capabilities" className="hover:text-white transition-colors">
                                    Capabilities
                                </Link>
                            </li>
                            <li>
                                <Link href="/portfolio" className="hover:text-white transition-colors">
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
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
                            <p>dq@drewquevedo.com</p>
                            <p>+1 (818) 213-1225</p>
                        </div>
                        <div className="mt-5 flex items-center gap-3 text-white/80">
                            <a
                                href="https://drewquevedo.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-magenta)]"
                                aria-label="Website"
                            >
                                <Globe size={17} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/drewquevedo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-magenta)]"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={17} />
                            </a>
                            <a
                                href="https://www.instagram.com/drewquevedo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-magenta)]"
                                aria-label="Instagram"
                            >
                                <Instagram size={17} />
                            </a>
                            <a
                                href="https://www.youtube.com/@drewquevedo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-magenta)]"
                                aria-label="YouTube"
                            >
                                <Youtube size={17} />
                            </a>
                        </div>
                    </div>

                    <div className="md:justify-self-end">
                        <Image
                            src="/assets/web_logo.png"
                            alt="Drew Quevedo Logic Agent"
                            width={320}
                            height={80}
                            className="h-20 w-auto object-contain"
                        />
                        <p className="mt-5 font-body text-sm text-white/55">
                            © 2026 DREWQUEVEDO.COM
                            <br />
                            All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
