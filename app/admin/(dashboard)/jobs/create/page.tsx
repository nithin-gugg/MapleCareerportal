"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TagInput } from "@/components/TagInput";
import { createJobAction } from "@/actions/jobs";

export default function CreateJobPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createJobAction(formData, skills);
    } catch (error) {
      console.error(error);
      setIsPending(false);
      alert("Error creating job. Please check the logs.");
    }
  };

  return (
    <div className="py-12 px-4 md:px-10 space-y-10 min-h-screen max-w-4xl mx-auto">
      <Link 
        href="/admin/jobs" 
        className="inline-flex items-center gap-2 text-[10px] font-black text-on-surface-variant hover:text-primary uppercase tracking-[0.3em] transition-colors group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Operational Slots
      </Link>

      <div className="space-y-3">
        <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">Configure Operational Slot</h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-tight">Deploy a new recruitment protocol into the active pipeline.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-surface-container-lowest border border-surface-container/20 p-10 md:p-14 rounded-[2.5rem] shadow-2xl shadow-black/[0.02]">
        <div className="grid grid-cols-1 gap-10">
          <div className="space-y-4">
            <label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">Slot Designation (Title)</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">badge</span>
              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Principal Systems Architect"
                className="w-full bg-surface-container-low border border-surface-container/30 rounded-2xl pl-14 pr-6 py-4 text-on-surface font-bold placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label htmlFor="type" className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">Operational Classification</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">category</span>
                <select
                  id="type"
                  name="type"
                  className="w-full bg-surface-container-low border border-surface-container/30 rounded-2xl pl-14 pr-6 py-4 text-on-surface font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none shadow-sm cursor-pointer"
                >
                  <option value="Full-time">Full-time Engagement</option>
                  <option value="Contract">Fixed-Term Contract</option>
                  <option value="Freelance">Independent Freelance</option>
                  <option value="Internship">Educational Internship</option>
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">Required Resonance Skills</label>
              <TagInput tags={skills} setTags={setSkills} />
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">Slot Requirements & Protocol (Description)</label>
            <div className="relative group">
              <textarea
                id="description"
                name="description"
                required
                rows={10}
                placeholder="Detail high-level requirements and operational expectations for this convergence slot..."
                className="w-full bg-surface-container-low border border-surface-container/30 rounded-3xl px-8 py-6 text-on-surface font-medium leading-relaxed placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none"
              />
              <div className="absolute top-6 right-6 opacity-10 group-focus-within:opacity-30 transition-opacity">
                 <span className="material-symbols-outlined text-4xl">description</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-surface-container/30">
          <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest italic max-w-xs text-center sm:text-left">
            By publishing, you initiate the ingestion protocol for this specific slot designation.
          </p>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full sm:w-auto btn-gradient text-on-primary font-headline font-black px-12 py-4 rounded-2xl flex items-center justify-center gap-3 soft-scale shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
          >
            {isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                <span>Executing Deployment...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                <span>Publish Slot</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
