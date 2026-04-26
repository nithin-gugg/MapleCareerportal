import React from "react";
import Link from "next/link";
import { getJobs } from "@/actions/jobs";
import { cn } from "@/lib/utils";

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="py-12 px-4 md:px-10 space-y-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">work_outline</span>
             </div>
             <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">Operational Slots</h1>
          </div>
          <p className="text-on-surface-variant text-sm font-medium tracking-tight">Active Recruitment Pipeline Inventory v1.0</p>
        </div>
        <Link href="/admin/jobs/create">
          <button className="btn-gradient text-on-primary font-headline font-black px-8 py-3.5 rounded-xl flex items-center gap-3 soft-scale shadow-lg shadow-primary/20 transition-all">
            <span className="material-symbols-outlined text-xl">add</span>
            Configure New Slot
          </button>
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-surface-container/20 overflow-hidden shadow-2xl shadow-black/[0.02]">
        {jobs.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-surface-container-low rounded-[2.5rem] flex items-center justify-center text-outline/30 mb-8 animate-in fade-in zoom-in">
              <span className="material-symbols-outlined text-5xl">work_off</span>
            </div>
            <div className="space-y-2 mb-10">
               <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight leading-none uppercase">Null Inventory</h3>
               <p className="text-on-surface-variant font-medium text-sm tracking-tight max-w-sm">No operational slots have been configured. Initiate a new deployment to begin candidate ingestion.</p>
            </div>
            <Link href="/admin/jobs/create">
              <button className="bg-primary/10 text-primary px-8 py-3.5 rounded-xl font-headline font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all soft-scale">
                Post First Slot
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-surface-container/20">
                  <th className="px-10 py-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Operational Designation</th>
                  <th className="px-10 py-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Classification</th>
                  <th className="px-10 py-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Live Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/30">
                {jobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-surface-container-low/40 transition-all duration-300">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all group-hover:scale-110",
                            job.status === "OPEN" ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"
                          )}>
                             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                          </div>
                          <div>
                            <div className="text-sm font-black text-on-surface tracking-tight group-hover:text-primary transition-colors underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-primary/30">{job.title}</div>
                            <div className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mt-1">Ref ID: {job.slug}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="inline-flex px-3 py-1 bg-surface-container-low rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 border border-surface-container/30">
                         {job.type}
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={cn(
                        "inline-flex items-center justify-center font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full",
                        job.status === "OPEN" 
                          ? "bg-primary-fixed/20 text-on-primary-fixed border-none" 
                          : "bg-surface-container-low text-on-surface-variant/40 border-none"
                      )}>
                        {job.status}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Link 
                        href={`/jobs/${job.slug}`} 
                        target="_blank"
                        className="w-10 h-10 rounded-xl bg-surface-container-low inline-flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-primary transition-all soft-scale group/link shadow-sm border border-surface-container/20"
                      >
                        <span className="material-symbols-outlined text-xl">open_in_new</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
