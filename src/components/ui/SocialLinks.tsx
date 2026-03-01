"use client";

import { ReactNode } from "react";
import { Linkedin, Youtube, Globe, Instagram } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type SocialItem = {
  name: string;
  href?: string;
  icon: ReactNode;
  label: string;
};

const SOCIALS: SocialItem[] = [
  {
    name: "Website",
    href: process.env.NEXT_PUBLIC_SOCIAL_WEBSITE_URL ?? "https://drewquevedo.com",
    icon: <Globe className="h-4 w-4" />,
    label: "Website",
  },
  {
    name: "LinkedIn",
    href:
      process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL ?? "https://www.linkedin.com/in/drewquevedo",
    icon: <Linkedin className="h-4 w-4" />,
    label: "LinkedIn",
  },
  {
    name: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL ?? "https://www.instagram.com/drewquevedo",
    icon: <Instagram className="h-4 w-4" />,
    label: "Instagram",
  },
  {
    name: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL ?? "https://www.youtube.com/@drewquevedo",
    icon: <Youtube className="h-4 w-4" />,
    label: "YouTube",
  },
];

export default function SocialLinks() {
  const visible = SOCIALS.filter((social) => Boolean(social.href));

  if (!visible.length) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-4 z-40 hidden flex-col gap-3 md:flex">
      {visible.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          onClick={() => trackEvent("social_click", { network: social.name.toLowerCase() })}
          className="neo-card flex h-10 w-10 items-center justify-center text-[var(--fg-1)] transition-transform hover:-translate-y-0.5 hover:text-[var(--accent-cyan)]"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
