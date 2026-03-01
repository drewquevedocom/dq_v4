"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import JarvisAssistantModal from "./JarvisAssistantModal";

type CallJarvisButtonProps = {
  phoneNumber?: string;
};

export default function CallJarvisButton({ phoneNumber }: CallJarvisButtonProps) {
  const number = phoneNumber?.trim();
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
    trackEvent("jarvis_modal_open", { source: "floating_button" });
  };

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      trackEvent("jarvis_modal_open", { source: "hero_cta" });
    };

    window.addEventListener("dq:jarvis-open", onOpen);
    return () => window.removeEventListener("dq:jarvis-open", onOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="fixed bottom-6 right-6 z-50 rounded-full border border-[rgba(168,85,247,0.65)] bg-[#7a43e6] px-6 py-3 font-tech text-[0.7rem] font-semibold uppercase tracking-widest text-white shadow-[0_0_25px_rgba(122,67,230,0.45)] transition-all hover:brightness-110"
        aria-label="Open Jarvis assistant options"
      >
        Call Jarvis
      </button>
      <JarvisAssistantModal
        open={open}
        onClose={() => setOpen(false)}
        phoneNumber={number}
      />
    </>
  );
}
