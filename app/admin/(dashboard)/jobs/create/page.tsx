"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TagInput } from "@/components/TagInput";
import { createJobAction } from "@/actions/jobs";
import dynamic from "next/dynamic";

// Dynamically import the editor to avoid SSR issues (Tiptap uses browser APIs)
const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-surface-container-low rounded-3xl" /> }
);

export default function CreateJobPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  const handleDescriptionChange = (html: string) => {
    setDescription(html);
    if (html && html.trim()) {
      setDescriptionError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate description
    if (!description || !description.trim() || description === "<p></p>") {
      setDescriptionError("Job description is required");
      return;
    }

    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    // Inject the RTE HTML into formData (the hidden input is handled automatically)
    formData.set("description", description);

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
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        Create Jobs
      </Link>

      <div className="space-y-3">
        <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">
          Create New Job role Vacancie
        </h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-tight">
          Add new Job role Vacancies .
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-surface-container-lowest p-10 md:p-14 rounded-[2.5rem] shadow-[0px_32px_64px_rgba(0,0,0,0.02)]"
      >
        {/* Hidden input so FormData has the HTML description */}
        <input type="hidden" name="description" value={description} readOnly />

        <div className="grid grid-cols-1 gap-10">
          {/* ── Job Title ──────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <label
              htmlFor="title"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2"
            >
              Job Role (Title)
            </label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                badge
              </span>
              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Principal Systems Architect"
                className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface font-bold placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* ── Classification + Skills ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label
                htmlFor="type"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2"
              >
                Job Classification
              </label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                  category
                </span>
                <select
                  id="type"
                  name="type"
                  className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none shadow-sm cursor-pointer"
                >
                  <option value="Full-time">Full-time Engagement</option>
                  <option value="Contract">Fixed-Term Contract</option>
                  <option value="Freelance">Independent Freelance</option>
                  <option value="Internship">Educational Internship</option>
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">
                Required Skills
              </label>
              <TagInput tags={skills} setTags={setSkills} />
            </div>
          </div>

          {/* ── Rich Text Description ───────────────────────────────────────── */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">
               Requirements & Responsibilities (Description)
            </label>
            <RichTextEditor
              value={description}
              onChange={handleDescriptionChange}
              error={descriptionError}
              placeholder="Write a structured job description with headings, bullet points, and sections… or click Template to get started."
            />
            {descriptionError && (
              <p className="text-destructive text-xs font-bold ml-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {descriptionError}
              </p>
            )}
          </div>
        </div>

        {/* ── Submit ─────────────────────────────────────────────────────────── */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface-container-low/30 -mx-10 md:-mx-14 -mb-10 md:-mb-14 p-10 md:p-14">
          <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest italic max-w-xs text-center sm:text-left">
            By publishing, you will create a new Job role
          </p>
          <button
            type="submit"
            disabled={isPending}
            id="publish-job-btn"
            className="w-full sm:w-auto btn-gradient text-on-primary font-headline font-black px-12 py-4 rounded-2xl flex items-center justify-center gap-3 soft-scale shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
          >
            {isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                <span>Creating Job...</span>
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  send
                </span>
                <span>Publish Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
