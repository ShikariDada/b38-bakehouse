import Image from "next/image";

export function Logo({ size = 38, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="B38 Bake House"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
