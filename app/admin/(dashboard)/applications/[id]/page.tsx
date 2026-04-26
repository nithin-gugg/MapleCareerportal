import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ApplicationActionButtons } from "@/components/admin/ApplicationActionButtons";
import { PipelineProgress } from "@/components/admin/PipelineProgress";
import { InterviewList } from "@/components/admin/InterviewList";
import { CheckScoreButton } from "@/components/admin/CheckScoreButton";
import { ExternalLink, Mail, Phone, Calendar, Briefcase, BrainCircuit, ChevronLeft, Users } from "lucide-react";
import Link from "next/link";
interface ApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const application = await db.application.findUnique({
    where: { id: params.id },
    include: { job: true, interviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!application) {
    notFound();
  }

  const matchingSkills = (application.matchingSkills as string[]) || [];

  return (
    <div className="py-12 px-4 md:px-10 space-y-12 min-h-screen">
      {/* Header / Meta Navigation */}
      <div className="space-y-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-[10px] font-black text-on-surface-variant hover:text-primary uppercase tracking-[0.3em] transition-colors group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Operational Dashboard
        </Link>
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="flex items-start gap-8">
             <div className="w-24 h-24 rounded-3xl bg-secondary-container flex items-center justify-center text-secondary shadow-lg shadow-secondary/10">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
             </div>
             <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={application.status} />
                  <div className="px-3 py-1 bg-surface-container-low rounded-full flex items-center gap-2 border border-surface-container/30">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                     <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{application.stage}</span>
                  </div>
                </div>
                <h1 className="font-headline text-5xl font-black tracking-tighter text-on-surface leading-none">
                  {application.name}
                </h1>
                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                    {application.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                    {application.phone}
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-surface-container-low/50 p-6 rounded-3xl border border-surface-container/20 flex items-center gap-4">
             <div className="hidden sm:block text-right pr-4 border-r border-surface-container">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">Current Protocol</p>
                <p className="text-sm font-bold text-on-surface">Application Control</p>
             </div>
             <ApplicationActionButtons 
               id={application.id} 
               currentStatus={application.status} 
               currentStage={application.stage} 
             />
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-surface-container/30 rounded-[2.5rem] p-10 shadow-xl shadow-black/[0.02]">
        <div className="flex items-center gap-4 mb-10">
           <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
           <h3 className="font-headline text-lg font-black text-on-surface tracking-tight uppercase tracking-[0.1em]">Candidate Progression Pipeline</h3>
        </div>
        <PipelineProgress currentStage={application.stage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: AI Breakdown & Interviews */}
        <div className="lg:col-span-2 space-y-12">
          {/* AI Insights Card */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden group shadow-sm border border-surface-container/20 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
            <div className="px-10 py-8 border-b border-surface-container/30 flex items-center justify-between bg-surface-container-low/20">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface">Cognitive Match Analysis</h2>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60">High-Fidelity Neural Scoring Engine</p>
                </div>
              </div>
              {application.score !== null && (
                <div className="text-right flex flex-col items-end">
                  <div className="text-5xl font-black text-primary leading-none tracking-tighter">{application.score}%</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mt-2 bg-primary/5 px-3 py-1 rounded-full">Convergence Index</div>
                </div>
              )}
            </div>
            
            <div className="p-10 space-y-10">
              {application.score === null ? (
                <div className="bg-surface p-8 rounded-3xl border border-surface-container/30 space-y-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant animate-pulse">
                     <span className="material-symbols-outlined text-3xl">query_stats</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-on-surface font-headline font-black text-lg">System Awaiting Initiation</p>
                    <p className="text-sm text-on-surface-variant font-medium max-w-sm mx-auto tracking-tight">
                      Run the neural analysis to calculate cross-functional convergence between candidate profile and operational requirements.
                    </p>
                  </div>
                  <CheckScoreButton applicationId={application.id} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Validated Skillsets</span>
                    <div className="flex-1 h-px bg-surface-container" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {matchingSkills.length > 0 ? (
                      matchingSkills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-5 py-2.5 bg-surface-container-low text-on-surface text-[11px] font-black uppercase tracking-widest rounded-xl border border-surface-container/40 hover:bg-primary-container hover:text-primary hover:border-primary transition-all soft-scale shadow-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-on-surface-variant/50 italic py-2">
                         <span className="material-symbols-outlined text-sm">info</span>
                         <span className="text-xs font-medium">Undefined skill resonance patterns.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-10 py-8 border-t border-surface-container/30 bg-surface-container-low/10">
              <a 
                href={application.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group/btn w-full px-8 py-5 bg-on-surface text-surface rounded-[1.25rem] font-headline font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-xl shadow-black/5 soft-scale"
              >
                <div className="flex items-center gap-4">
                   <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                   <span>Inspect Original Document</span>
                </div>
                <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">open_in_new</span>
              </a>
            </div>
          </div>

          {/* New Interviews Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-l-4 border-primary pl-6">
              <h2 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none uppercase">Operational Sprints</h2>
              <span className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">Interview Schedule</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
               <InterviewList interviews={application.interviews} />
            </div>
          </div>
        </div>

        {/* Right Column: Info Card */}
        <div className="space-y-10">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-10 space-y-8 shadow-sm border border-surface-container/20">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant pb-4 border-b border-surface-container/30">Intake Metadata</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="text-primary mt-1">
                   <span className="material-symbols-outlined">work</span>
                </div>
                <div>
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Operational Slot</div>
                  <div className="text-base font-black text-on-surface tracking-tight">{application.job.title}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-secondary mt-1">
                   <span className="material-symbols-outlined">event</span>
                </div>
                <div>
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Ingestion Timestamp</div>
                  <div className="text-base font-bold text-on-surface tracking-tight">
                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-accent mt-1">
                   <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Source Validation</div>
                  <div className="text-base font-bold text-on-surface tracking-tight">Standard Public Portal</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            <div className="w-16 h-16 bg-surface-container-lowest rounded-2xl flex items-center justify-center text-primary shadow-sm soft-scale group-hover:rotate-12 transition-transform">
               <span className="material-symbols-outlined text-3xl">fact_check</span>
            </div>
            <p className="text-sm text-on-surface-variant font-bold leading-relaxed tracking-tight px-2">
              Finalize convergence analysis before initiating subsequent interview protocols.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
