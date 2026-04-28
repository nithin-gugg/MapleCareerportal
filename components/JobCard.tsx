import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { JobBadge } from "./JobBadge";
import { JsonValue } from "@prisma/client/runtime/library";

interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  type?: string | null;
  skills: JsonValue; // Better than any
  createdAt: Date;
}

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const skills = (Array.isArray(job.skills) ? job.skills : []) as string[];

  return (
    <div className="group relative bg-surface-container-lowest border border-surface-container/20 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 flex-1">
          <div className="inline-flex px-3 py-1 bg-surface-container-low rounded-lg text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 border border-surface-container/30 transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
            {job.type || "Full-time"}
          </div>
          <h3 className="font-headline text-2xl font-black text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
        </div>
        <div className="w-12 h-12 bg-surface-container-low rounded-2xl flex items-center justify-center text-on-surface-variant transition-all group-hover:scale-110 group-hover:rotate-6">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>work_outline</span>
        </div>
      </div>

      <p className="text-sm text-on-surface-variant font-medium leading-relaxed tracking-tight opacity-60 line-clamp-3 mb-8 flex-1">
        {job.description}
      </p>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest px-3 py-1.5 bg-surface-container-low rounded-xl border border-surface-container/30">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-widest self-center ml-2 italic">
              +{skills.length - 3} more
            </span>
          )}
        </div>

        <Link
          href={`/jobs/${job.slug}`}
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#00DC82] text-black font-headline font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all soft-scale shadow-xl shadow-black/5"
        >
          Apply Now  
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
