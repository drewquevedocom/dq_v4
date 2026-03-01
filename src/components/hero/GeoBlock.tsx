"use client";

type GeoBlockProps = {
  content: string;
  isVisible: boolean;
};

export default function GeoBlock({ content, isVisible }: GeoBlockProps) {
  return (
    <div
      className={`mx-auto mt-3 w-full max-w-[620px] transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="rounded-2xl border border-white/12 bg-black/45 p-3 backdrop-blur-md md:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
          <span className="font-tech text-[0.52rem] uppercase tracking-widest text-[var(--accent-green)]/90">
            GEO Signal
          </span>
        </div>

        <p className="text-left font-body text-xs leading-relaxed text-white/70 md:text-[0.82rem]">
          {content}
        </p>
      </div>
    </div>
  );
}
