export interface StageCTA {
  label: string;
  href: string;
}

export interface StageData {
  id: string;
  label: string;
  asset: string;
  assetType: "image" | "video";
  headline: string;
  subHeadline: string;
  directAnswer: string;
  primaryCTA: StageCTA;
  secondaryCTA: StageCTA;
  subLink: StageCTA;
  overlayType: "metrics" | "blueprint" | null;
  bgGradient: string;
  accentColor: string;
  keywords?: string[];
}
