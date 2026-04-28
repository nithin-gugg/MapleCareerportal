"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
const X = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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

  return (
    <div className="flex flex-wrap items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
      <div className="flex-1 min-w-[200px]">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Job Role</label>
        <select
          value={searchParams.get("jobId") || ""}
          onChange={(e) => handleFilterChange("jobId", e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-[#00DC82] transition-colors"
        >
          <option value="">All Positions</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Status</label>
        <select
          value={searchParams.get("status") || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-[#00DC82] transition-colors"
        >
          <option value="">Any Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFERED">Offered</option>
        </select>
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Min Score</label>
        <input
          type="number"
          min="0"
          max="100"
          defaultValue={searchParams.get("score") || ""}
          onBlur={(e) => handleFilterChange("score", e.target.value)}
          placeholder="e.g. 70"
          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-[#00DC82] transition-colors"
        />
      </div>

      <div className="flex items-end h-full self-end pb-1">
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors px-2"
        >
          <X size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}
