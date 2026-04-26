"use client";

import React, { useState } from "react";
import { BrainCircuit, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { runAiAnalysisAction } from "@/actions/applications";
import { toast } from "sonner";

interface CheckScoreButtonProps {
  applicationId: string;
}

export function CheckScoreButton({ applicationId }: CheckScoreButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleAnalysis = async () => {
    // Double-click / duplicate request guard
    if (isPending) return;

    setIsPending(true);
    const toastId = toast.loading("Scanning resume with AI...", {
      description: "This may take 10–30 seconds depending on the ML service.",
    });

    try {
      const result = await runAiAnalysisAction(applicationId);

      if (result.success) {
        toast.success(
          `AI Score: ${result.score}%`,
          {
            id: toastId,
            description: "Resume successfully analyzed. Refresh to see matching skills.",
            icon: <CheckCircle2 size={16} className="text-[#00DC82]" />,
            duration: 6000,
          }
        );
      } else {
        toast.error("Analysis failed", {
          id: toastId,
          description: result.error || "An unknown error occurred.",
          icon: <AlertCircle size={16} />,
          duration: 8000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error during analysis", { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      <button
        id="check-ai-score-btn"
        onClick={handleAnalysis}
        disabled={isPending}
        aria-label="Check AI candidate score"
        aria-busy={isPending}
        className="w-full py-4 px-6 bg-[#00DC82] text-black font-black uppercase tracking-widest text-sm hover:bg-[#00DC82]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 relative overflow-hidden"
      >
        {/* Animated shimmer line while loading — shows activity for slow ML calls */}
        {isPending && (
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite linear",
            }}
          />
        )}

        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Scanning Resume...
          </>
        ) : (
          <>
            <BrainCircuit size={18} />
            Check AI Candidate Score
          </>
        )}
      </button>

      {/* Progress context message for long-running operations */}
      {isPending && (
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold text-center animate-pulse">
          Connecting to ML service · Please wait
        </p>
      )}
    </div>
  );
}
