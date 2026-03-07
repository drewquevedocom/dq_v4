"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { BLOG_POSTS } from "@/data/blog";

export default function BlogPage() {
  useEffect(() => {
    trackEvent("blog_view");
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-white">
      <NoiseLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] neo-grid opacity-50" />
      <Header />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-32 pt-40 md:px-8 md:pt-52">
        <Link
          href="/#home"
          className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="neo-chip">Insights</span>
          </div>
          <h1 className="font-display text-[10vw] uppercase leading-[0.85] tracking-[-0.01em] text-white md:text-[6vw]">
            The <span className="text-[var(--accent-cyan)]">Blog</span>
          </h1>
          <p className="mt-6 max-w-2xl text-balance font-body text-lg leading-relaxed text-[var(--fg-2)]">
            Insights on AI agents, high-ticket scaling, and the systems running behind the scenes.
          </p>
        </motion.div>

        <div className="mt-16 h-px w-full bg-gradient-to-r from-[rgba(70,204,255,0.4)] to-transparent" />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-[var(--accent-cyan)]/50 hover:bg-white/[0.07]"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-white/10">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80 opacity-60 mix-blend-luminosity"
                />
              </div>

              <div className="flex flex-col flex-grow p-8">
                <div>
                  <div className="mb-4 flex items-center justify-between text-xs font-tech uppercase tracking-widest text-white/50">
                    <span className="text-[var(--accent-cyan)]">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="mb-4 font-display text-2xl uppercase tracking-wide text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="mb-8 font-body leading-relaxed text-[var(--fg-2)] text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <span className="font-tech text-[10px] uppercase tracking-widest text-[var(--accent-magenta)]">{post.readTime}</span>
                  <Link href={`/blog/${post.slug}`} className="font-tech text-xs uppercase tracking-widest text-white hover:text-[var(--accent-cyan)] transition-colors">
                    Read Core Data &rarr;
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </main>
    </div>
  );
}
