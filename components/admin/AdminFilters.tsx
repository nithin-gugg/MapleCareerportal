"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminFiltersProps {
  jobs: { id: string; title: string }[];
}

export function AdminFilters({ jobs }: AdminFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset to page 1 on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`?${createQueryString(name, value)}`);
  };

  const clearFilters = () => {
    router.push("/admin");
  };

  const currentJobId = searchParams.get("jobId") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentJobTitle = jobs.find((j) => j.id === currentJobId)?.title || "All Positions";
  const currentStatusLabel = currentStatus || "Any Status";

  return (
    <div className="flex flex-wrap items-center gap-6 bg-surface-container-lowest p-6 border border-surface-container/20 rounded-[2rem] shadow-sm">
      <div className="flex-1 min-w-[200px] space-y-2">
        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60 block ml-1">Job Role</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-11 rounded-xl bg-surface-container-low border-surface-container text-on-surface font-medium px-4">
              <span className="truncate">{currentJobTitle}</span>
              <ChevronDown className="ml-2 opacity-40 shrink-0" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-surface-container/30">
            <DropdownMenuItem onClick={() => handleFilterChange("jobId", "")}>
              All Positions
            </DropdownMenuItem>
            {jobs.map((job) => (
              <DropdownMenuItem key={job.id} onClick={() => handleFilterChange("jobId", job.id)}>
                {job.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 min-w-[150px] space-y-2">
        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60 block ml-1">Status</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-11 rounded-xl bg-surface-container-low border-surface-container text-on-surface font-medium px-4">
              <span className="truncate">{currentStatusLabel}</span>
              <ChevronDown className="ml-2 opacity-40 shrink-0" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-surface-container/30">
            <DropdownMenuItem onClick={() => handleFilterChange("status", "")}>Any Status</DropdownMenuItem>
            {["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "OFFERED"].map((status) => (
              <DropdownMenuItem key={status} onClick={() => handleFilterChange("status", status)}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 min-w-[120px] space-y-2">
        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60 block ml-1">Min Score</label>
        <input
          type="number"
          min="0"
          max="100"
          defaultValue={searchParams.get("score") || ""}
          onBlur={(e) => handleFilterChange("score", e.target.value)}
          placeholder="e.g. 70"
          className="w-full h-11 bg-surface-container-low border border-surface-container text-on-surface rounded-xl px-4 text-sm focus:outline-none focus:border-primary transition-all font-medium placeholder:opacity-30"
        />
      </div>

      <div className="flex items-end h-11 self-end">
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant hover:text-error uppercase tracking-widest transition-all px-4 h-full hover:bg-error/5 rounded-xl"
        >
          <X size={14} className="stroke-[3]" />
          Reset
        </button>
      </div>
    </div>
  );
}
