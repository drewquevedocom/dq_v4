import Link from "next/link";
import { clsx } from "clsx";

interface BeamButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function BeamButton({
  children,
  href,
  className,
  onClick,
}: BeamButtonProps) {
  const inner = <span>{children}</span>;

  if (href) {
    return (
      <Link href={href} className={clsx("beam-button", className)}>
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={clsx("beam-button", className)}>
      {inner}
    </button>
  );
}
