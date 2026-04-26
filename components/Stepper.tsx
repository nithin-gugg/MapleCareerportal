import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-16 px-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1;
        const isActive = currentStep === index + 1;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative group">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                  isCompleted
                    ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20 rotate-[-5deg]"
                    : isActive
                    ? "bg-surface-container-low border-primary text-primary shadow-2xl shadow-primary/10 scale-110 z-10"
                    : "bg-surface-container border-surface-container-high text-on-surface-variant/30"
                )}
              >
                {isCompleted ? (
                   <span className="material-symbols-outlined text-2xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "absolute -bottom-8 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500",
                  isActive ? "text-primary opacity-100 translate-y-0" : "text-on-surface-variant opacity-40 translate-y-1"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-4 transition-all duration-700",
                  isCompleted ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-surface-container-high"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
