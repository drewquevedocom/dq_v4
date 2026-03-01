import { Ref } from "react";

interface OrbitalBlobsProps {
  blob1Ref: Ref<HTMLDivElement>;
  blob2Ref: Ref<HTMLDivElement>;
  blob3Ref: Ref<HTMLDivElement>;
}

export default function OrbitalBlobs({
  blob1Ref,
  blob2Ref,
  blob3Ref,
}: OrbitalBlobsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <div
        ref={blob1Ref}
        className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-50"
        style={{
          backgroundColor: "#4B0082",
          filter: "blur(140px)",
          willChange: "transform, background-color",
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute -bottom-60 -right-48 h-[520px] w-[520px] rounded-full opacity-40"
        style={{
          backgroundColor: "#a78bfa",
          filter: "blur(160px)",
          willChange: "transform, background-color",
        }}
      />
      <div
        ref={blob3Ref}
        className="absolute top-1/2 left-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          backgroundColor: "#8B00FF",
          filter: "blur(120px)",
          willChange: "transform, background-color",
        }}
      />
    </div>
  );
}

