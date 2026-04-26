import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getJobBySlug } from "@/actions/jobs";
import { Container } from "@/components/Container";
import { ApplicationForm } from "@/components/ApplicationForm";
import { notFound } from "next/navigation";

interface ApplyPageProps {
  params: {
    slug: string;
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface py-24 relative overflow-hidden">
       {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <Container className="max-w-3xl relative z-10">
        <Link 
          href={`/jobs/${job.slug}`} 
          className="inline-flex items-center gap-3 text-on-surface-variant/40 hover:text-primary mb-12 text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
        >
          <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
          Return to Slot Specification
        </Link>

        <div className="mb-16 space-y-4">
          <div className="inline-flex px-3 py-1 bg-surface-container-low rounded-lg text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 border border-surface-container/30">
            Candidate Intake Protocol
          </div>
          <h1 className="font-headline text-5xl font-black tracking-tighter text-on-surface uppercase leading-none">
            Initiate <span className="text-primary italic">Sync</span> Protocol for {job.title}
          </h1>
          <p className="text-on-surface-variant text-lg font-medium tracking-tight opacity-60 max-w-xl">
            Commence the calibration process. Please provide the required data points for neural evaluation by the <span className="text-on-surface font-black italic tracking-tighter">GREENHIRE ENGINE</span>.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] p-1 shadow-2xl shadow-black/[0.02]">
            <ApplicationForm jobId={job.id} jobTitle={job.title} />
        </div>
      </Container>
    </div>
  );
}
