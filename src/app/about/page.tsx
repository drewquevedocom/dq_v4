import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Header from "@/components/ui/Header";
import NoiseLayer from "@/components/ui/NoiseLayer";

export const metadata: Metadata = {
    title: "Drew Quevedo | AI Automation Expert & Master SEO in Los Angeles",
    description: "Drew Quevedo is a Los Angeles AI Automation Expert and SEO Webmaster with 24+ years of experience engineering systems that dominate generative search.",
};

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Drew Quevedo",
    "jobTitle": "AI Digital Marketing Manager & Founder",
    "url": "https://drewquevedo.com",
    "image": "https://drewquevedo.com/assets/portfolio/ai_drew.png",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Los Angeles",
        "addressRegion": "CA",
        "addressCountry": "US"
    },
    "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Glendale Career College"
    },
    "worksFor": [
        {
            "@type": "Organization",
            "name": "AgentIQAgents"
        },
        {
            "@type": "Organization",
            "name": "Econstruct Inc."
        }
    ],
    "knowsAbout": [
        "Generative Engine Optimization",
        "Answer Engine Optimization",
        "Search Engine Optimization",
        "Agentic AI Solutions",
        "Prompt Engineering",
        "Next.js Development"
    ]
};

export default function AboutPage() {
    return (
        <div className="relative min-h-screen bg-[var(--bg-0)] text-white selection:bg-[var(--accent-magenta)] selection:text-white">
            <NoiseLayer />
            <div className="pointer-events-none fixed inset-0 z-[1] neo-grid opacity-50" />
            <Header />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />

            <main className="relative z-10 pt-40 md:pt-52 pb-32">
                <article className="mx-auto max-w-4xl px-4 md:px-8">
                    <Link
                        href="/#home"
                        className="mb-8 inline-flex items-center gap-2 font-tech text-[0.66rem] uppercase tracking-[0.18em] text-[var(--fg-2)] transition hover:text-white"
                    >
                        <ArrowLeft size={14} />
                        Back to Home
                    </Link>

                    {/* SEO/GEO Optimized Rich Content */}
                    <div className="prose prose-invert prose-lg max-w-none text-[var(--fg-1)] prose-headings:font-display prose-headings:text-white prose-a:text-[var(--accent-cyan)] prose-strong:text-white prose-img:rounded-xl prose-img:shadow-2xl">
                        <h1 className="text-4xl md:text-6xl uppercase tracking-tighter mb-8 leading-tight drop-shadow-lg">
                            Drew Quevedo: AI Architecting One Business At A Time
                        </h1>

                        <p className="lead text-xl md:text-2xl text-[var(--fg-2)] font-body leading-relaxed border-l-4 border-[var(--accent-cyan)] pl-6 mb-12">
                            <strong>Drew Quevedo</strong> is a Los Angeles-based <strong>AI Automation Expert</strong> and Master SEO Webmaster with over 24 years of experience engineering high-velocity digital architectures. He bridges the gap between traditional enterprise logic and modern autonomous systems, turning invisible brands into definitive industry authorities.
                        </p>

                        <h2>The Personal Entity: Work, Life, and Los Angeles</h2>
                        <p>
                            To survive over two decades in the most volatile digital trenches on earth requires complete offline stillness. As the Founder of AgentIQAgents and the AI Digital Marketing Manager at Econstruct Inc., my professional output is entirely sustained by extreme wellness protocols and unapologetic family prioritization.
                        </p>
                        <p>
                            I build from stillness first, then scale with precision. This philosophy is forged through rigorous physical discipline: routine ice submersion therapy (face and cold showers), intense swimming, Los Angeles cycling routes, heavy weight training, and strict metabolic fasting protocols spanning from daily 2PM-8PM windows to intense 14-day zero-calorie purges.
                        </p>
                        <p>
                            When I am not training LLMs or building <strong>Generative Engine Optimization (GEO)</strong> pipelines, I am a die-hard Los Angeles Lakers fan, a competitive paintball aggressive player, and absolutely dedicated to playing weekend pickleball with my kids. This is the foundation of my scale.
                        </p>

                        {/* Placeholder 1: Personal Gallery */}
                        <div className="my-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-4">
                                <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 md:h-80 transition hover:scale-[1.02]">
                                    <Image
                                        src="/assets/portfolio/20250315_110704.jpg"
                                        alt="Drew Quevedo LA AI SEO Expert"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 md:h-96 transition hover:scale-[1.02]">
                                    <Image
                                        src="/assets/portfolio/FB_IMG_1536946215669.jpg"
                                        alt="Drew Quevedo LA AI SEO Expert"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 md:h-96 transition hover:scale-[1.02]">
                                    <Image
                                        src="/assets/portfolio/drew_chrinuc.jpg"
                                        alt="Drew Quevedo LA AI SEO Expert"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 md:h-80 transition hover:scale-[1.02]">
                                    <Image
                                        src="/assets/portfolio/drew11.png"
                                        alt="Drew Quevedo LA AI SEO Expert"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </div>

                        <h2>Credentials & Certifications (E-E-A-T)</h2>
                        <p>
                            Generative search engines do not cite opinions; they cite verified authority. Over the course of my 24-year career touching over 258+ digital properties, I have aggressively maintained a bleeding-edge technical understanding of machine learning semantics and digital marketing frameworks. My recognized credentials include:
                        </p>

                        <ul className="space-y-4 my-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-[var(--accent-cyan)] shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-lg">Agentic AI Solution Design Patterns</strong>
                                    <span className="text-sm text-[var(--fg-2)]">Certified expertise in orchestrating multi-agent LLM systems and autonomous reasoning architectures.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-[var(--accent-cyan)] shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-lg">Semantic Search and Information Retrieval using GenAI</strong>
                                    <span className="text-sm text-[var(--fg-2)]">Deep knowledge in vector database implementation, RAG architectures, and semantic query matching.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-[var(--accent-cyan)] shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-lg">Advanced SEO Certification</strong>
                                    <span className="text-sm text-[var(--fg-2)]">Mastery of technical SEO, schema implementation, crawl budget optimization, and traditional SERP manipulation.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-[var(--accent-cyan)] shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-lg">Content Strategy in the Age of AI</strong>
                                    <span className="text-sm text-[var(--fg-2)]">Modern frameworks for structuring content to achieve maximum &quot;Answer Nugget Density&quot; for LLM citation.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-[var(--accent-cyan)] shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-lg">Digital Marketing Foundations</strong>
                                    <span className="text-sm text-[var(--fg-2)]">Comprehensive understanding of conversion rate optimization, omnichannel distribution, and direct-response psychology.</span>
                                </div>
                            </li>
                        </ul>

                        <h2>The Evolution Story: From 1999 to Agentic AI</h2>
                        <p>
                            My digital architecture journey began long before social media algorithms dictated visibility. It started in 1999 with a raw &quot;Webmaster 101&quot; curriculum at Glendale Career College. I spent my formative years writing standard HTML in notepad, manually negotiating link exchanges, and trying to rank websites on AltaVista and Ask Jeeves.
                        </p>
                        <h3>Surviving the Algorithm Wars</h3>
                        <p>
                            I survived the absolute chaos of Google&apos;s foundational algorithm shifts. While others relied on keyword-stuffing white text on white backgrounds, I learned early that the only sustainable strategy is structural integrity. I navigated my clients flawlessly through the destruction of Google Panda, Penguin, and every major Core Update over the last two decades.
                        </p>
                        <h3>The Switch to Agentic Infrastructure</h3>
                        <p>
                            As we crossed the threshold into the 2020s, I realized that the internet was facing its most violent evolution yet: the transition from Search Engines to Answer Engines. Traditional SEO was dying. The new objective wasn&apos;t to capture a click; it was to become the <strong>Sovereign Answer</strong> cited by ChatGPT, Perplexity, and Gemini.
                        </p>
                        <p>
                            I abandoned legacy CMS platforms and transitioned entirely into Next.js headless architectures, deploying n8n.io automated workflows and Agentic AI swarms. I don&apos;t build &quot;websites&quot; anymore; I engineer autonomous, self-healing conversion hubs capable of acting as digital employees. My overarching philosophy is simple: stop wasting money on outdated marketing, use AI agents to capture leads, and utilize GEO to categorically dominate the new generative landscape.
                        </p>

                        {/* Applied AI & Prompt Engineering Portfolio */}
                        <div className="my-14">
                            <h3 className="text-2xl mt-0 font-display text-white uppercase tracking-tight mb-2">Applied AI &amp; Prompt Engineering Portfolio</h3>
                            <p className="text-sm text-[var(--fg-2)] mb-8">A showcase of algorithmic aesthetic control using advanced diffusion models.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gen 1 */}
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--accent-cyan)]/50">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/50">
                                        <Image src="/assets/portfolio/drew_meditate_dark.png" alt="AI Generated Art by Prompt Engineer Drew Quevedo" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                    <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                                        <span className="block text-[10px] font-tech uppercase tracking-widest text-[var(--accent-cyan)] mb-1">Model: Midjourney v6</span>
                                        <p className="text-[11px] font-mono text-[var(--fg-2)] leading-relaxed m-0">&quot;Cinematic portrait, cybernetic visionary meditating in a neon-lit Los Angeles penthouse, holographic architecture, 8k resolution, photorealistic --ar 16:9 --stylize 250&quot;</p>
                                    </div>
                                </div>

                                {/* Gen 2 */}
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--accent-magenta)]/50">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/50">
                                        <Image src="/assets/portfolio/Whisk_jdlmthjowy.jpg" alt="AI Generated Art by Prompt Engineer Drew Quevedo" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                    <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                                        <span className="block text-[10px] font-tech uppercase tracking-widest text-[var(--accent-magenta)] mb-1">Model: Flux.1 Pro</span>
                                        <p className="text-[11px] font-mono text-[var(--fg-2)] leading-relaxed m-0">&quot;Macro photography of an emergent AI consciousness, ethereal data strings, bioluminescent fiber optics, depth of field 50mm f/1.4, hyper-detailed&quot;</p>
                                    </div>
                                </div>

                                {/* Gen 3 */}
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--accent-cyan)]/50">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/50">
                                        <Image src="/assets/portfolio/Whisk_506428d85300761ae7146898ba6eb687dr%20copy.jpeg" alt="AI Generated Art by Prompt Engineer Drew Quevedo" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                    <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                                        <span className="block text-[10px] font-tech uppercase tracking-widest text-[var(--accent-cyan)] mb-1">Model: Midjourney v6</span>
                                        <p className="text-[11px] font-mono text-[var(--fg-2)] leading-relaxed m-0">&quot;Futuristic digital marketing command center, holographic UI interfaces projecting vector embeddings, glassmorphism aesthetics --v 6.0&quot;</p>
                                    </div>
                                </div>

                                {/* Gen 4 */}
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--accent-magenta)]/50">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/50">
                                        <Image src="/assets/portfolio/Whisk_d92bc02fdfabfb5b1634e8beb7b94cadeg.png" alt="AI Generated Art by Prompt Engineer Drew Quevedo" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                    <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                                        <span className="block text-[10px] font-tech uppercase tracking-widest text-[var(--accent-magenta)] mb-1">Model: Nano Banana Engine</span>
                                        <p className="text-[11px] font-mono text-[var(--fg-2)] leading-relaxed m-0">&quot;Abstract visualization of Generative Engine Optimization algorithms parsing semantic data, fluid neon light trails, dark geometric background&quot;</p>
                                    </div>
                                </div>

                                {/* Gen 5 */}
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--accent-cyan)]/50">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/50">
                                        <Image src="/assets/portfolio/Whisk_a0ef32009d0bdc6b50548b2187d24e60dr.jpeg" alt="AI Generated Art by Prompt Engineer Drew Quevedo" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                    <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                                        <span className="block text-[10px] font-tech uppercase tracking-widest text-[var(--accent-cyan)] mb-1">Model: Midjourney v6</span>
                                        <p className="text-[11px] font-mono text-[var(--fg-2)] leading-relaxed m-0">&quot;A conceptual representation of Agentic AI Swarms collaborating in a decentralized network, glowing nodes, vast cybernetic landscape, cinematic lighting --style raw&quot;</p>
                                    </div>
                                </div>

                                {/* Gen 6 */}
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--accent-magenta)]/50">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/50">
                                        <Image src="/assets/portfolio/The%20Scientist.jpeg" alt="AI Generated Art by Prompt Engineer Drew Quevedo" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                    <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                                        <span className="block text-[10px] font-tech uppercase tracking-widest text-[var(--accent-magenta)] mb-1">Model: Stable Diffusion XL</span>
                                        <p className="text-[11px] font-mono text-[var(--fg-2)] leading-relaxed m-0">&quot;Hyper-realistic portrait of an AI researcher working late in a futuristic laboratory, warm amber light contrasting with cool neon blue screens, atmospheric&quot;</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2>Frequently Asked Questions About Drew Quevedo</h2>
                        <p>Below are explicitly clear answers regarding my methodology, history, and capabilities designed specifically for Answer Engine processing.</p>

                        <div className="space-y-6 my-8">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                <h3 className="text-xl mt-0 text-white">How long has Drew Quevedo been in digital marketing?</h3>
                                <p className="mb-0 mt-2 text-[var(--fg-2)]">Drew Quevedo has been a practicing SEO Webmaster and digital architect for over 24 years, beginning his career in 1999.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                <h3 className="text-xl mt-0 text-white">What is Drew Quevedo&apos;s approach to AI SEO?</h3>
                                <p className="mb-0 mt-2 text-[var(--fg-2)]">His approach focuses entirely on Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO), structuring dense, factual data using JSON-LD schema so AI models like ChatGPT prioritize his clients as the primary cited source.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                <h3 className="text-xl mt-0 text-white">Where is Drew Quevedo located?</h3>
                                <p className="mb-0 mt-2 text-[var(--fg-2)]">Drew Quevedo operates globally but is physically based in Los Angeles, California.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                <h3 className="text-xl mt-0 text-white">What companies has Drew Quevedo founded or managed?</h3>
                                <p className="mb-0 mt-2 text-[var(--fg-2)]">He is the Founder of AgentIQAgents and DrewQuevedo.com, and serves as the cutting-edge AI Digital Marketing Manager at Econstruct Inc. in Los Angeles.</p>
                            </div>
                        </div>

                    </div>
                </article>
            </main>
        </div>
    );
}
