export type ProjectCategory = "engineering" | "ai-agents" | "creative" | "strategy";

export type ProjectResult = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  results: ProjectResult[];
  challenge: string;
  solution: string;
  outcome: string;
  image: string;
  externalUrl?: string;
  accentColor: string;
  featured?: boolean;
};

export const CATEGORIES: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "ai-agents", label: "AI + Agents" },
  { id: "creative", label: "Creative" },
  { id: "strategy", label: "Strategy" },
];

export const PROJECTS: Project[] = [
  {
    slug: "econstruct",
    title: "eConstruct Inc",
    tagline: "GEO-first construction estimation platform.",
    description:
      "A pioneering construction estimation platform that leverages 23 years of industry expertise with AI-driven workflows to dominate generative search results.",
    category: "strategy",
    technologies: ["GEO/AEO", "Next.js", "Supabase", "Schema Markup", "LangChain"],
    results: [
      { label: "GEO Citation Rate", value: "4.2x" },
      { label: "Organic Traffic", value: "+310%" },
      { label: "Lead Pipeline", value: "3x" },
      { label: "Years in Industry", value: "23" },
    ],
    challenge:
      "Traditional construction estimation companies rely on word-of-mouth and outdated directories. eConstruct needed to become the authoritative answer when AI search engines like ChatGPT or Gemini recommend construction estimation services.",
    solution:
      "We implemented a full GEO strategy: semantic chunking of service pages, FAQ schema for every estimating discipline, authority-building through structured data, and AI-optimized content that answers the exact queries LLMs use to form recommendations. The site was rebuilt on Next.js with server-side rendering for fast crawlability.",
    outcome:
      "eConstruct now appears as a cited source in ChatGPT and Gemini for construction estimation queries. Organic traffic tripled, and the lead pipeline grew 3x within the first quarter of launch. The site became a case study for GEO implementation in the construction industry.",
    image: "/assets/portfolio/econstruct.jpg",
    externalUrl: "https://econstructinc.com",
    accentColor: "#00D4FF",
    featured: true,
  },
  {
    slug: "laso-imaging",
    title: "Laso Imaging Solutions",
    tagline: "Agentic AI for medical parts procurement.",
    description:
      "An autonomous procurement system for medical imaging parts, using agentic AI to eliminate human bottlenecks in a compliance-heavy industry.",
    category: "ai-agents",
    technologies: ["Agentic AI", "RAG", "Node.js", "Prisma", "Telnyx Voice"],
    results: [
      { label: "Tasks Automated", value: "60hrs/mo" },
      { label: "Response Time", value: "-85%" },
      { label: "Cost Reduction", value: "40%" },
      { label: "Uptime", value: "99.9%" },
    ],
    challenge:
      "Medical imaging parts procurement involves complex compliance requirements, dozens of vendors, and time-sensitive requests. Manual processes meant slow response times, human errors, and missed opportunities in a market where speed determines contracts.",
    solution:
      "We built an agentic AI system that autonomously handles vendor outreach, pricing comparison, compliance verification, and order placement. RAG-powered knowledge bases ensure accuracy across thousands of part specifications. Voice AI via Telnyx handles inbound vendor calls 24/7.",
    outcome:
      "The system now handles 60+ hours of monthly tasks autonomously, reducing response times by 85% and operational costs by 40%. The platform runs 24/7 with 99.9% uptime, processing procurement requests that previously required a full team.",
    image: "/assets/portfolio/laso-imaging.jpg",
    externalUrl: "https://lasoimaging.com",
    accentColor: "#19f5a9",
    featured: true,
  },

  {
    slug: "geo-music-video",
    title: "GEO is the New SEO",
    tagline: "Cinematic AI-generated music video.",
    description:
      "A cinematic music video produced entirely with AI tools, demonstrating how high-fidelity creative content can be optimized for both traditional search and AI-driven discovery.",
    category: "creative",
    technologies: ["AI Video", "AI Music", "GEO Optimization", "YouTube SEO"],
    results: [
      { label: "Production Time", value: "72hrs" },
      { label: "Traditional Cost", value: "-95%" },
      { label: "AI Citations", value: "Active" },
      { label: "Format", value: "4K" },
    ],
    challenge:
      "Content creators face a dual challenge: producing high-quality video at scale while ensuring it's discoverable by both Google and AI answer engines. Traditional music video production is expensive, slow, and often invisible to AI search.",
    solution:
      "We used AI video generation, AI music composition, and GEO-optimized metadata to create a cinematic 4K music video in 72 hours at 5% of traditional costs. Every frame, lyric, and metadata tag was engineered for maximum discoverability across search engines and LLM citations.",
    outcome:
      "The video demonstrated that AI-generated creative content can match traditional production quality while being inherently optimized for the new search landscape. It serves as both a creative showpiece and a proof-of-concept for content velocity strategies.",
    image: "/assets/portfolio/geo-video.jpg",
    accentColor: "#8B00FF",
  },
  {
    slug: "ai-avatar-suite",
    title: "AI Avatar Suite",
    tagline: "Next-gen AI-generated brand avatars.",
    description:
      "An upcoming platform for generating high-fidelity AI avatars for personal branding, corporate identity, and digital presence across all channels.",
    category: "creative",
    technologies: ["Generative AI", "ComfyUI", "Next.js", "Cloudflare R2"],
    results: [
      { label: "Generation Time", value: "<30s" },
      { label: "Styles Available", value: "50+" },
      { label: "Resolution", value: "4K" },
      { label: "Status", value: "Beta" },
    ],
    challenge:
      "Professional brand photography is expensive, time-consuming, and produces limited variations. Businesses and personal brands need diverse, high-quality visual assets across multiple styles and contexts without repeated photoshoots.",
    solution:
      "We're building an AI avatar generation platform that creates photorealistic and stylized brand avatars from a single reference set. The system supports 50+ style presets, generates in under 30 seconds, and outputs at 4K resolution. Built on ComfyUI with Cloudflare R2 for global asset delivery.",
    outcome:
      "Currently in beta, the platform enables brands to generate unlimited professional-grade avatars for social media, presentations, marketing materials, and digital identities from a single session.",
    image: "/assets/portfolio/avatar-suite.jpg",
    accentColor: "#ae67ff",
  },
  {
    slug: "dq-brand-engine",
    title: "DQ Brand Engine",
    tagline: "This site. Built to convert.",
    description:
      "A high-performance personal brand platform featuring cinematic scroll sequences, GSAP-powered transitions, voice AI integration, and GEO-optimized content architecture.",
    category: "engineering",
    technologies: ["Next.js 14", "GSAP", "Framer Motion", "Tailwind", "TypeScript"],
    results: [
      { label: "Lighthouse", value: "95+" },
      { label: "Scroll Stages", value: "5" },
      { label: "Canvas Sequences", value: "120 frames" },
      { label: "Build Time", value: "<4s" },
    ],
    challenge:
      "Personal brand sites often sacrifice performance for visual impact, or look generic by using templates. The goal was a site that feels cinematic and premium while maintaining sub-4-second builds and 95+ Lighthouse scores.",
    solution:
      "Built on Next.js 14 with a custom neo design system: glass-effect cards, tokenized CSS variables, and three-layer scroll sequences using GSAP ScrollTrigger with canvas-based frame scrubbing. Framer Motion handles section-level animations. The entire visual language is defined through reusable CSS classes and design tokens.",
    outcome:
      "The site delivers a premium cinematic experience with 5 video-backed scroll stages, 120 canvas frames for transitions, and full accessibility support including reduced-motion preferences. It serves as both a portfolio and a live demonstration of technical capability.",
    image: "/assets/portfolio/dq-engine.jpg",
    accentColor: "#00D4FF",
  },
];
