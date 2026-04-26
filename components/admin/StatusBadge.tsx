import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "OFFERED" | "APPLIED" | "ASSESSMENT" | "INTERVIEW1" | "INTERVIEW2" | "OFFER";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-zinc-900 text-zinc-400 border-zinc-800" },
  REVIEWED: { label: "Reviewed", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  SHORTLISTED: { label: "Shortlisted", className: "bg-[#00DC82]/10 text-[#00DC82] border-[#00DC82]/20" },
  REJECTED: { label: "Rejected", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  OFFERED: { label: "Offered", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  APPLIED: { label: "Applied", className: "bg-zinc-900 text-zinc-400 border-zinc-800" },
  ASSESSMENT: { label: "Assessment", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  INTERVIEW1: { label: "1st Interview", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  INTERVIEW2: { label: "2nd Interview", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  OFFER: { label: "Offer Phase", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-zinc-900 text-zinc-400 border-zinc-800" };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-widest border",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
