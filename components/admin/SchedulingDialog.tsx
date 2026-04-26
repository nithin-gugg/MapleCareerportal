"use client";

import React, { useState, useTransition } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { scheduleInterviewAction } from "@/actions/applications";
import { Loader2, Calendar as CalendarIcon, Users } from "lucide-react";
import { toast } from "sonner";

interface SchedulingDialogProps {
  applicationId: string;
  round: number;
  trigger: React.ReactNode;
}

export function SchedulingDialog({ applicationId, round, trigger }: SchedulingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [startTime, setStartTime] = useState("");
  const [interviewerInput, setInterviewerInput] = useState("");

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime) {
      toast.error("Please select a date and time");
      return;
    }

    const emails = interviewerInput
      .split(",")
      .map(e => e.trim())
      .filter(e => e.length > 0);

    startTransition(async () => {
      const toastId = toast.loading(`Scheduling Round ${round} interview...`);

      const result = await scheduleInterviewAction(applicationId, {
        round,
        startTime,
        interviewerEmails: emails
      });

      if (result.success) {
        toast.success("Interview scheduled & Google Meet link created!", { id: toastId });
        setIsOpen(false);
        // Reset form fields for next use
        setStartTime("");
        setInterviewerInput("");
      } else {
        if (result.error === "GOOGLE_NOT_CONNECTED") {
          toast.error("Google account not connected. Redirecting to connect...", { id: toastId });
          setTimeout(() => {
            window.location.href = "/api/google/connect";
          }, 1500);
        } else {
          toast.error(result.error || "Failed to schedule interview", { id: toastId });
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isPending && setIsOpen(open)}>
      <DialogTrigger render={<span />} onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-surface-container-lowest border-surface-container/20 text-on-surface max-w-lg p-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-primary/5 px-10 py-10 border-b border-surface-container/20">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
               </div>
               <div>
                  <DialogTitle className="font-headline text-3xl font-black tracking-tighter text-on-surface uppercase">
                    Protocol {round}
                  </DialogTitle>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60">
                    Interview Synchronization Protocol
                  </p>
               </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSchedule} className="p-10 space-y-10">
          <div className="space-y-10">
            {/* Time Picker */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">calendar_month</span>
                Temporal Alignment (Date & Time)
              </label>
              <div className="relative group">
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-surface-container-low border border-surface-container/30 rounded-2xl px-6 py-4 text-on-surface font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm invert-calendar-icon hover:bg-surface-container disabled:opacity-50"
                />
              </div>
            </div>

            {/* Interviewers Input */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">group</span>
                Synchronization Agents (Emails)
              </label>
              <div className="relative group">
                <textarea
                  placeholder="hr.ops@greenhire.io, technical.lead@greenhire.io"
                  value={interviewerInput}
                  onChange={(e) => setInterviewerInput(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-surface-container-low border border-surface-container/30 rounded-2xl px-6 py-4 text-sm font-medium min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none placeholder:text-outline/30 hover:bg-surface-container disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-surface-container/20">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 btn-gradient text-on-primary h-16 rounded-2xl font-headline font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 soft-scale shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
            >
              {isPending ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule_send</span>
                  <span>Initiate Protocol & Link</span>
                </>
              )}
            </button>
            <DialogClose
              disabled={isPending}
              className="px-10 h-16 bg-surface-container-low text-on-surface-variant font-headline font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-surface-container transition-all soft-scale border border-surface-container/30 disabled:opacity-50"
            >
              Decline
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
