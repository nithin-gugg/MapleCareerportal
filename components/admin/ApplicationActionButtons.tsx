"use client";

import React, { useTransition } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Send, 
  Loader2, 
  UserCheck, 
  FileCheck,
  ChevronRight
} from "lucide-react";
import { SchedulingDialog } from "./SchedulingDialog";
import { updateApplicationStatusAction } from "@/actions/applications";
import { toast } from "sonner";

type AppStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "OFFERED" | undefined;
type AppStage = "APPLIED" | "ASSESSMENT" | "INTERVIEW1" | "INTERVIEW2" | "OFFER" | undefined;

interface ApplicationActionButtonsProps {
  id: string;
  currentStatus: string;
  currentStage: string;
}

const STAGE_FLOW = ["APPLIED", "ASSESSMENT", "INTERVIEW1", "INTERVIEW2", "OFFER"];

export function ApplicationActionButtons({ id, currentStatus, currentStage }: ApplicationActionButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (status?: AppStatus, stage?: AppStage) => {
    startTransition(async () => {
      const toastId = toast.loading(
        stage ? `Moving to ${stage}...` : `Updating status...`
      );
      const result = await updateApplicationStatusAction(id, { status, stage });
      if (result.success) {
        toast.success(
          stage
            ? `Moved to ${stage.charAt(0) + stage.slice(1).toLowerCase()}`
            : status === "REJECTED"
            ? "Application rejected"
            : status === "SHORTLISTED"
            ? "Candidate shortlisted"
            : status === "PENDING"
            ? "Application re-opened"
            : "Status updated",
          { id: toastId }
        );
      } else {
        toast.error(result.error || "Failed to update application", { id: toastId });
      }
    });
  };

  const currentStageIndex = STAGE_FLOW.indexOf(currentStage);
  const nextStage = STAGE_FLOW[currentStageIndex + 1] as AppStage;

  const getNextStageLabel = (stage: string) => {
    switch (stage) {
      case "ASSESSMENT": return "Send Assessment";
      case "INTERVIEW1": return "Schedule 1st Interview";
      case "INTERVIEW2": return "Schedule 2nd Interview";
      case "OFFER": return "Proceed to Offer";
      default: return "Next Stage";
    }
  };

  const getNextStageIcon = (stage: string) => {
    switch (stage) {
      case "ASSESSMENT": return <Send size={14} />;
      case "INTERVIEW1": return <UserCheck size={14} />;
      case "INTERVIEW2": return <UserCheck size={14} />;
      case "OFFER": return <FileCheck size={14} />;
      default: return <ChevronRight size={14} />;
    }
  };

  const renderNextStepButton = () => {
    if (!nextStage || currentStatus === "REJECTED") return null;

    const isInterview = nextStage === "INTERVIEW1" || nextStage === "INTERVIEW2";
    
    const buttonContent = (
      <span className="flex items-center gap-2 px-8 py-4 bg-[#00DC82] text-black border border-[#00DC82] rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-[#00DC82] transition-all group cursor-pointer">
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            {getNextStageIcon(nextStage)}
            {getNextStageLabel(nextStage)}
          </>
        )}
      </span>
    );

    if (isInterview) {
      return (
        <SchedulingDialog 
          applicationId={id} 
          round={nextStage === "INTERVIEW1" ? 1 : 2} 
          trigger={buttonContent}
        />
      );
    }

    return (
      <button
        onClick={() => handleAction(undefined, nextStage)}
        disabled={isPending}
        aria-label={getNextStageLabel(nextStage)}
      >
        {buttonContent}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Prime Next Step Action */}
      {renderNextStepButton()}

      {/* Auxiliary Actions */}
      <div className="flex items-center gap-2">
        {currentStatus === "PENDING" && (
          <button
            onClick={() => handleAction("SHORTLISTED")}
            disabled={isPending}
            aria-label="Shortlist candidate"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-zinc-400 border border-zinc-900 text-[10px] font-black uppercase tracking-widest hover:border-[#00DC82] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={14} />
            Shortlist
          </button>
        )}

        {currentStatus !== "REJECTED" && (
          <button
            onClick={() => handleAction("REJECTED")}
            disabled={isPending}
            aria-label="Reject candidate"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-zinc-400 border border-zinc-900 text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={14} />
            Reject
          </button>
        )}

        {currentStatus === "REJECTED" && (
          <button
            onClick={() => handleAction("PENDING")}
            disabled={isPending}
            aria-label="Re-open application"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Re-open Application
          </button>
        )}
      </div>
    </div>
  );
}
