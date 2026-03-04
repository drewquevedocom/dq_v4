"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import SectionTitle from "./SectionTitle";
import SectionSubtitle from "./SectionSubtitle";

export default function RecentInsights() {
    // Grab latest 3 posts
    const recentPosts = BLOG_POSTS.slice(0, 3);

    return (
        <section className="relative z-10 w-full snap-start px-4 py-24 md:px-8 md:py-28 bg-black">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <span className="neo-chip">Insights & Strategy</span>
                        <div className="mt-5">
                            <SectionTitle
                                title="Latest Briefs"
                                pulseWord="Briefs"
                                titleClassName="text-[clamp(2.6rem,9vw,6rem)]"
                            />
                        </div>
                        <SectionSubtitle
                            text="Generative Engine Optimization (GEO) strategies, Agentic architectures, and scaling playbooks."
                            keywords={['Generative Engine Optimization (GEO)', 'Agentic architectures', 'scaling playbooks']}
                            className="mt-4 max-w-2xl text-[var(--fg-2)]"
                        />
                    </div>
                    <Link
                        href="/blog"
                        className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-tech text-[0.66rem] uppercase tracking-widest text-[var(--fg-1)] transition hover:border-[var(--accent-cyan)] hover:text-white"
                    >
                        View Dispatch Library
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-cyan)]" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {recentPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[rgba(10,15,30,0.82)] transition hover:border-[var(--accent-cyan)]/50"
                        >
                            <div className="relative h-64 w-full overflow-hidden bg-white/5">
                                <Image
                                    src={post.headerImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-6 sm:p-8">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="font-tech text-xs uppercase tracking-widest text-[var(--accent-cyan)]">
                                        {post.category}
                                    </span>
                                    <span className="font-tech text-xs uppercase tracking-widest text-[var(--fg-2)]">
                                        {post.readTime}
                                    </span>
                                </div>
                                <h3 className="mb-3 font-display text-2xl uppercase tracking-tight text-white transition group-hover:text-[var(--accent-cyan)] line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="mt-auto font-body text-sm leading-relaxed text-[var(--fg-2)] line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-6 flex items-center gap-2 font-tech text-xs uppercase tracking-widest text-white transition group-hover:text-[var(--accent-cyan)]">
                                    Read Dispatch
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
