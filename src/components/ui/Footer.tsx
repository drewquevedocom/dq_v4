import BeamButton from "./BeamButton";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-jesper-dark px-6 pb-16 pt-24 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center">
          <div>
            <Image
              src="/assets/web_logo.png"
              alt="Drew Quevedo Logic Agent"
              width={320}
              height={80}
              className="h-20 w-auto object-contain"
            />
            <div className="mt-3 font-display text-2xl font-semibold text-white">
              Ready to build your AI-powered brand?
            </div>
            <div className="mt-2 text-sm text-white/40">
              hello@drewquevedo.com
            </div>
          </div>
          <BeamButton href="/dashboard">Start a Project</BeamButton>
        </div>
      </div>
    </footer>
  );
}
