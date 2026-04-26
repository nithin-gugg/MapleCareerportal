"use client";

import { useEffect } from "react";
import { Container } from "@/components/Container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-surface min-h-screen text-on-surface flex items-center justify-center py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-error/5 blur-[120px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      
      <Container className="max-w-2xl text-center relative z-10">
        <div className="bg-surface-container-lowest border border-error/20 rounded-[2.5rem] p-12 shadow-2xl shadow-black/[0.02]">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-4xl text-error">warning</span>
          </div>
          
          <h1 className="font-headline text-4xl font-black mb-4 tracking-tighter text-on-surface uppercase">
            System Anomaly Detected
          </h1>
          
          <p className="text-on-surface-variant font-medium text-lg mb-10 opacity-70">
            A critical exception occurred during execution. Our monitoring systems have logged the fault.
          </p>

          <button
            onClick={() => reset()}
            className="btn-gradient bg-surface-container-low border border-surface-container/50 hover:bg-surface-container px-10 py-4 text-on-surface font-headline font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all soft-scale"
          >
            Attempt Re-initialization
          </button>
        </div>
      </Container>
    </div>
  );
}
