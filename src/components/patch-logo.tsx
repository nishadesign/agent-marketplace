import { cn } from "@/lib/utils";

interface PatchLogoProps {
  size?: number;
  className?: string;
  variant?: "default" | "dark";
}

export function PatchLogo({ size = 32, className, variant = "default" }: PatchLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <rect
        width="32"
        height="32"
        rx="8"
        fill={variant === "dark" ? "#F0F0F0" : "currentColor"}
      />
      <circle
        cx="16"
        cy="16"
        r="8"
        fill={variant === "dark" ? "#1A1A1A" : "white"}
      />
    </svg>
  );
}
