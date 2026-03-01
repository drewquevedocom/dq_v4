"use client";

import Link from "next/link";
import { Phone, Sparkles, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type JarvisAssistantModalProps = {
  open: boolean;
  onClose: () => void;
  phoneNumber?: string;
};

export default function JarvisAssistantModal({
  open,
  onClose,
  phoneNumber,
}: JarvisAssistantModalProps) {
  if (!open) {
    return null;
  }

  const hasPhone = Boolean(phoneNumber?.trim());

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[rgba(10,12,24,0.92)] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.55)] md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-tech text-[0.58rem] uppercase tracking-widest text-white/90">
              <Sparkles size={12} />
              Jarvis Assistant
            </div>
            <h3 className="font-display text-2xl tracking-tight text-white md:text-3xl">
              Executive Call Concierge
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-white/75">
              Jarvis qualifies your goals, timeline, and budget so the strategy call is high-signal from minute one.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 transition hover:text-white"
            aria-label="Close Jarvis popup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {hasPhone ? (
            <a
              href={`tel:${phoneNumber}`}
              onClick={() => trackEvent("cta_call_jarvis_click", { source: "jarvis_modal" })}
              className="flex w-full items-center justify-between rounded-xl border border-[rgba(168,85,247,0.45)] bg-[rgba(122,67,230,0.22)] px-4 py-3 text-left transition hover:bg-[rgba(122,67,230,0.32)]"
            >
              <span>
                <span className="block font-tech text-[0.6rem] uppercase tracking-widest text-white/75">Immediate</span>
                <span className="block font-body text-sm font-semibold text-white">Call Jarvis Now</span>
              </span>
              <Phone size={16} className="text-white" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-left opacity-70"
            >
              <span className="block font-tech text-[0.6rem] uppercase tracking-widest text-white/75">Immediate</span>
              <span className="block font-body text-sm font-semibold text-white">Configure `NEXT_PUBLIC_JARVIS_PSTN_NUMBER`</span>
            </button>
          )}

          <Link
            href="/book-strategy"
            onClick={() => trackEvent("cta_book_strategy_click", { source: "jarvis_modal" })}
            className="block w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 transition hover:border-white/30"
          >
            <span className="block font-tech text-[0.6rem] uppercase tracking-widest text-white/70">Scheduling</span>
            <span className="block font-body text-sm font-semibold text-white">Book a Strategy Session</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
