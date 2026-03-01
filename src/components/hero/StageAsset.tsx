import Image from "next/image";

interface StageAssetProps {
  src: string;
  type: "image" | "video";
  alt: string;
}

export default function StageAsset({ src, type, alt }: StageAssetProps) {
  if (type === "video") {
    return (
      <div className="relative w-[72vw] max-w-[860px] aspect-video rounded-[36px] overflow-hidden">
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>
    );
  }

  return (
    <div className="relative w-[72vw] max-w-[860px] aspect-[4/3] rounded-[36px] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="72vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
    </div>
  );
}
