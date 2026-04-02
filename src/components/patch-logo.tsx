import { cn } from "@/lib/utils";

interface PatchLogoProps {
  size?: number;
  className?: string;
}

export function PatchLogo({ size = 32, className }: PatchLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <circle cx="16" cy="16" r="8" fill="white" />
    </svg>
  );
}
