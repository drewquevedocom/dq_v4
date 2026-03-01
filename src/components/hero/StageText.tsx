interface StageTextProps {
  label: string;
  headline: string;
}

export default function StageText({ label, headline }: StageTextProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-tech text-[0.65rem] uppercase tracking-widest text-white/60">
        {label}
      </p>
      <h2 className="font-display mt-4 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl">
        {headline}
      </h2>
    </div>
  );
}
