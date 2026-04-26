import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "APPLIED", label: "Applied" },
  { id: "ASSESSMENT", label: "Assessment" },
  { id: "INTERVIEW1", label: "Interview 1" },
  { id: "INTERVIEW2", label: "Interview 2" },
  { id: "OFFER", label: "Offer" },
];

interface PipelineProgressProps {
  currentStage: string;
}

export function PipelineProgress({ currentStage }: PipelineProgressProps) {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-4xl mx-auto">
        {/* Background Connector Bar */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-900 -translate-y-1/2 z-0" />
        
        {/* Active Connector Bar */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#00DC82] -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                  isCompleted 
                    ? "bg-[#00DC82] border-[#00DC82] text-black" 
                    : isActive 
                      ? "bg-black border-[#00DC82] text-[#00DC82] shadow-[0_0_15px_rgba(0,220,130,0.3)]" 
                      : "bg-black border-zinc-800 text-zinc-600"
                )}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={4} />
                ) : (
                  <span className="text-[10px] font-black">{index + 1}</span>
                )}
              </div>
              
              <div className="absolute -bottom-6 flex flex-col items-center min-w-[80px]">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-500 text-center",
                  isActive ? "text-[#00DC82]" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {stage.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
