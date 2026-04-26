import { getJobs } from "@/actions/jobs";
import { Container } from "@/components/Container";
import { JobCard } from "@/components/JobCard";
import { Briefcase } from "lucide-react";

export default async function JobsPage() {
  const jobs = await getJobs("OPEN");

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Hero Section */}
      <section className="py-24 border-b border-surface-container/30 bg-surface-container-low/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <Container>
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-[0.3em]">
               <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
               Active Pipeline
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-none text-on-surface uppercase">
              Operational <span className="text-primary italic">Slots</span>.
            </h1>
            <p className="text-xl text-on-surface-variant font-medium leading-relaxed tracking-tight max-w-xl opacity-70">
              Contribute to the evolution of human-machine intelligence. Calibrate your expertise against our active operational requirements.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-xl">work</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-on-surface">{jobs.length}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Active Scripts</span>
                 </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Jobs Grid */}
      <section className="py-24 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <Container>
          {jobs.length === 0 ? (
            <div className="text-center py-32 bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center text-outline/30 mb-8">
                 <span className="material-symbols-outlined text-5xl">event_busy</span>
              </div>
              <h2 className="font-headline text-2xl font-black text-on-surface tracking-tight uppercase mb-2">Null Inventory</h2>
              <p className="text-on-surface-variant font-medium text-sm tracking-tight">No active operational slots are currently awaiting deployment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
