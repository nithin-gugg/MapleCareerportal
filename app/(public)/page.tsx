import { Container } from '@/components/Container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-surface">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-secondary/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <Container className="py-20 md:py-32 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
            Operational Intelligence Platform
          </div>
          
          <div className="space-y-6 max-w-5xl">
            <h1 className="font-headline text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] text-on-surface">
              Maple<span className="text-primary italic">HIRE</span>.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed tracking-tight opacity-70">
              The high-fidelity execution layer for modern talent acquisition. Calibrate your recruitment protocols with neural scoring and precision scheduling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 items-center">
            <Link href="/jobs">
              <button className="btn-gradient px-12 py-5 text-on-primary text-xs font-headline font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-4 soft-scale shadow-2xl shadow-primary/20 transition-all">
                Apply Now
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </button>
            </Link>
            <Link href="/admin">
              <button className="px-12 py-5 bg-surface-container-low text-on-surface-variant text-xs font-headline font-black uppercase tracking-[0.2em] rounded-2xl border border-surface-container/40 hover:bg-surface-container transition-all soft-scale">
                Admin Console
              </button>
            </Link>
          </div>

          <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl opacity-40">
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-black text-on-surface tracking-tighter uppercase">50ms</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Neural Latency</span>
             </div>
             <div className="flex flex-col items-center gap-2 border-x border-surface-container py-2">
                <span className="text-2xl font-black text-on-surface tracking-tighter uppercase">99.9%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Match Reliability</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-black text-on-surface tracking-tighter uppercase">24/7</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active Ingestion</span>
             </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
