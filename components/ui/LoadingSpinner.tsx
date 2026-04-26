import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** Size in pixels passed to lucide-react icon */
  size?: number;
  className?: string;
}

/**
 * LoadingSpinner — A reusable animated spinner that matches the HRMS design system.
 * Uses lucide-react Loader2 with animate-spin for a consistent look.
 */
export function LoadingSpinner({ size = 16, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin", className)}
      aria-label="Loading"
    />
  );
}
