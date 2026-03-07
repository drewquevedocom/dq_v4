import { BLOG_POSTS } from "@/data/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";

// Generate static params for all blogs so they are built statically
export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

// Generate optimal SEO/GEO metadata based on the slug
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Drew Quevedo – AI SEO & GEO Expert`,
        description: post.excerpt,
        keywords: ["AI SEO optimization", "GEO", "Generative Engine Optimization", "Los Angeles Local SEO", post.category, "optimal organic traffic"],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            images: [
                {
                    url: post.headerImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.headerImage],
        },
    };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-[var(--accent-magenta)] selection:text-white">
            <Header />

            <main className="relative z-10 pt-40 md:pt-52 pb-32">
                <article className="mx-auto max-w-4xl px-4 md:px-8">

                    <Link
                        href="/blog"
                        className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
                    >
                        <ArrowLeft size={14} />
                        Back to Insights
                    </Link>

                    <header className="mb-12">
                        <div className="mb-6 flex items-center gap-4 text-xs font-tech uppercase tracking-widest text-[var(--accent-cyan)]">
                            <span>{post.category}</span>
                            <span className="text-[var(--fg-2)]">&bull;</span>
                            <span className="text-[var(--fg-2)]">{post.date}</span>
                            <span className="text-[var(--fg-2)]">&bull;</span>
                            <span className="text-[var(--accent-magenta)]">{post.readTime}</span>
                        </div>

                        <h1 className="font-display text-4xl leading-tight md:text-6xl lg:text-7xl uppercase tracking-tighter mb-6 text-white drop-shadow-lg">
                            {post.title}
                        </h1>

                        <p className="font-body text-xl md:text-2xl text-[var(--fg-2)] leading-relaxed max-w-3xl">
                            {post.excerpt}
                        </p>
                    </header>

                </article>

                <div className="w-full relative h-[40vh] md:h-[60vh] max-w-7xl mx-auto my-16 px-4 md:px-8">
                    <div className="absolute inset-0 mx-4 md:mx-8 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <img
                            src={post.headerImage}
                            alt={post.title}
                            className="w-full h-full object-cover mix-blend-luminosity opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    </div>
                </div>

                <div className="mx-auto max-w-3xl px-4 md:px-8">
                    {/* Table of Contents and Content injected via rich HTML */}
                    <div
                        className="prose prose-invert prose-lg prose-p:text-[var(--fg-1)] prose-p:leading-loose prose-a:text-[var(--accent-cyan)] hover:prose-a:text-[var(--accent-magenta)] prose-p:font-body prose-headings:font-display prose-headings:text-white prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-strong:text-white prose-blockquote:border-l-[var(--accent-magenta)] prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:not-italic prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:text-white prose-blockquote:shadow-lg prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-10 prose-u:decoration-[var(--accent-magenta)] prose-u:underline-offset-8 prose-ul:font-body prose-ul:text-[var(--fg-1)] prose-li:marker:text-[var(--accent-cyan)] max-w-none first-letter:text-6xl first-letter:font-display first-letter:text-[var(--accent-cyan)] first-letter:mr-2 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-24 pt-10 border-t border-white/10">
                        <Link href="/book-strategy" className="inline-flex w-full flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent px-8 py-8 md:py-10 transition-all duration-300 hover:border-[var(--accent-cyan)]/50 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(70,204,255,0.15)] group relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight group-hover:text-[var(--accent-cyan)] transition-colors">Ready to Dominate Search?</h4>
                                <p className="font-body text-base text-[var(--fg-2)] mt-3 max-w-md">Deploy our 60 years of combined SEO and cutting-edge AI GEO experience to capture your market.</p>
                            </div>
                            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent-magenta)] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform duration-300 group-hover:scale-110">
                                <ArrowLeft size={24} className="rotate-135 transform -scale-x-100" />
                            </div>
                            {/* Background flare */}
                            <div className="absolute -inset-20 bg-gradient-to-r from-[var(--accent-magenta)] to-[var(--accent-cyan)] opacity-0 blur-2xl transition duration-500 group-hover:opacity-10 pointer-events-none" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
