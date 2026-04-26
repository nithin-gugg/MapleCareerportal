"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { 
  Video, 
  Calendar as CalendarIcon, 
  Mail, 
  CheckCircle2,
  Loader2,
  ExternalLink 
} from "lucide-react";
import { sendInterviewInviteAction } from "@/actions/applications";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Interview {
  id: string;
  round: number;
  date: Date;
  meetLink: string | null;
  inviteSent: boolean;
  status: string;
}

interface InterviewListProps {
  interviews: Interview[];
}

/**
 * InterviewInviteButton — Isolated component so each interview card gets its
 * own independent loading state. Memoized to prevent unnecessary re-renders.
 */
const InterviewInviteButton = memo(function InterviewInviteButton({ interview }: { interview: Interview }) {
  const [isPending, setIsPending] = useState(false);

  const handleSendInvite = useCallback(async () => {
    if (isPending) return; // double-click guard
    try {
      setIsPending(true);
      const toastId = toast.loading("Initiating interview synchronization protocol...");
      const result = await sendInterviewInviteAction(interview.id);
      if (result.success) {
        toast.success("Candidate notification protocol successful!", { id: toastId });
      } else {
        toast.error(result.error || "Protocol failure", { id: toastId });
      }
    } catch (err) {
      toast.error("Unexpected synchronization error");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }, [isPending, interview.id]);

  if (interview.inviteSent) {
    return (
      <div className="flex items-center justify-center gap-3 p-4 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        <span className="text-[11px] font-black uppercase tracking-widest">
          Protocol Verified
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleSendInvite}
      disabled={isPending}
      aria-label={`Send interview invitation for Round ${interview.round}`}
      className="w-full btn-gradient text-on-primary h-14 rounded-2xl font-headline font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 soft-scale shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
    >
      {isPending ? (
        <>
          <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
          <span>Deploying Invitations...</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-lg">send</span>
          <span>Approve & Deploy Notification</span>
        </>
      )}
    </button>
  );
});

export const InterviewList = memo(function InterviewList({ interviews }: InterviewListProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (interviews.length === 0) {
    return (
      <div className="bg-surface-container-low/30 border-2 border-surface-container border-dashed rounded-[2.5rem] p-16 text-center group hover:border-primary/30 transition-colors">
        <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-outline/30 mx-auto mb-6 group-hover:rotate-6 transition-transform">
           <span className="material-symbols-outlined text-4xl">event_busy</span>
        </div>
        <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
          Null Operational Protocols
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-inter">
      {interviews.map((interview) => (
        <div 
          key={interview.id} 
          className="bg-surface-container-lowest rounded-[2.5rem] border border-surface-container/20 overflow-hidden relative group shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col"
        >
          {/* Header */}
          <div className="p-8 space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2">
                  Operational Phase {interview.round}
                </span>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors",
                interview.inviteSent 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "bg-surface-container-low text-on-surface-variant border-surface-container/30"
              )}>
                {interview.inviteSent ? "Verified" : "Pending Notification"}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shadow-sm transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              </div>
              <div>
                <p className="text-on-surface text-lg font-black tracking-tight leading-none mb-1">
                  {isMounted ? new Date(interview.date).toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : "Awaiting Temporal Data..."}
                </p>
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest opacity-50">
                  {isMounted ? new Date(interview.date).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : "Synchronizing..."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-surface-container-low/30 px-8 py-8 flex flex-col gap-4 border-t border-surface-container/20">
            {interview.meetLink && (
              <a 
                href={interview.meetLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-6 h-14 bg-surface-container-lowest rounded-2xl border border-surface-container/30 hover:border-primary transition-all group/link shadow-sm soft-scale"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface underline decoration-transparent decoration-2 underline-offset-4 group-hover/link:decoration-primary/30 transition-all">
                    Secure Video Uplink
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline/30 text-lg group-hover/link:text-primary transition-colors">open_in_new</span>
              </a>
            )}

            <InterviewInviteButton interview={interview} />
          </div>
        </div>
      ))}
    </div>
  );
});
