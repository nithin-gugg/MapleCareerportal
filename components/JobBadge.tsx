import React from "react";
import { cn } from "@/lib/utils";

interface JobBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function JobBadge({ children, className }: JobBadgeProps) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/20 text-[10px] font-semibold tracking-wider uppercase",
      className
    )}>
      {children}
    </span>
  );
}
