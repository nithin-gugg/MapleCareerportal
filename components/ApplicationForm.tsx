"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Stepper } from "./Stepper";
import { submitApplicationAction } from "@/actions/applications";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  resume: z.any().refine((file) => file instanceof File || (file && typeof file === 'object' && 'name' in file), "Resume is required"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false,
    },
  });

  const selectedResume = watch("resume");

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ["resume"];
    if (step === 2) fieldsToValidate = ["name", "email", "phone"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Ingesting specification & synchronizing profile...", {
      description: "Neural networks are processing your credentials.",
    });

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("jobId", jobId);
      formData.append("resume", data.resume);

      const result = await submitApplicationAction(formData);

      if (result.success) {
        toast.success("Synchronization successful!", {
          id: toastId,
          description: "Your operational profile is now active in the pipeline.",
          duration: 5000,
        });
        setIsSuccess(true);
      } else {
        toast.error(result.error || "Synchronization failure", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected operational error during transmission", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24 bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] shadow-2xl shadow-black/[0.02]"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner group">
           <span className="material-symbols-outlined text-5xl text-primary animate-in zoom-in-50 duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
        </div>
        <h2 className="font-headline text-5xl font-black mb-6 tracking-tighter text-on-surface uppercase">Protocol Verified</h2>
        <p className="text-on-surface-variant font-medium max-w-sm mx-auto mb-12 text-lg opacity-60 leading-relaxed">
          Operational profile received for the <span className="text-primary font-black italic">{jobTitle}</span> slot. Calibrations have commenced.
        </p>
        <button 
          onClick={() => window.location.href = "/jobs"} 
          className="btn-gradient text-on-primary font-headline font-black px-12 py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] soft-scale shadow-2xl shadow-primary/20"
        >
          Return to Inventory
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full font-inter">
      <div className="p-10 md:p-16">
        <Stepper steps={["Ingestion", "Calibration", "Verification"]} currentStep={step} />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-20 space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tight">Ingest Specification</h2>
                  <p className="text-on-surface-variant text-sm font-medium opacity-60">Provide your operational history in schema-validated PDF/DOC format.</p>
                </div>

                <div className="space-y-6">
                  <div 
                    className={cn(
                      "relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-16 transition-all duration-500 flex flex-col items-center justify-center gap-6",
                      selectedResume 
                        ? "border-primary bg-primary/[0.03] shadow-inner" 
                        : "border-surface-container-high hover:border-primary/50 hover:bg-surface-container-low/50",
                      errors.resume ? "border-error bg-error/5" : ""
                    )}
                    onClick={() => document.getElementById("resume-input")?.click()}
                  >
                    <div className={cn(
                      "w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                      selectedResume ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "text-outline/30"
                    )}>
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: selectedResume ? "'FILL' 1" : "'FILL' 0" }}>
                        {selectedResume ? "description" : "upload_file"}
                      </span>
                    </div>
                    
                    <div className="text-center space-y-1">
                      <p className="font-headline text-lg font-black text-on-surface uppercase tracking-tight">
                        {selectedResume ? selectedResume.name : "Initiate Uplink"}
                      </p>
                      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                        Standard PDF/DOC Assets • Limit 5.0MB
                      </p>
                    </div>

                    <input
                      id="resume-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setValue("resume", file);
                      }}
                    />
                  </div>
                  {errors.resume && (
                    <div className="flex items-center gap-2 text-error px-4 animate-in fade-in slide-in-from-top-2">
                       <span className="material-symbols-outlined text-sm">warning</span>
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none">{errors.resume.message as string}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tight">Calibration Data</h2>
                  <p className="text-on-surface-variant text-sm font-medium opacity-60">Synchronize your identity and communication channels with the engine.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Candidate Name</label>
                    <input
                      {...register("name")}
                      placeholder="Protocol Name (e.g. Sterling Archer)"
                      className="w-full bg-surface-container-low border border-surface-container px-6 py-4 rounded-2xl text-on-surface font-medium focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-sm focus:shadow-xl focus:shadow-primary/5"
                    />
                    {errors.name && <p className="text-error text-[9px] font-black uppercase tracking-widest ml-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Neural Channel (Email)</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="address@uplink.io"
                      className="w-full bg-surface-container-low border border-surface-container px-6 py-4 rounded-2xl text-on-surface font-medium focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-sm focus:shadow-xl focus:shadow-primary/5"
                    />
                    {errors.email && <p className="text-error text-[9px] font-black uppercase tracking-widest ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-3 group md:col-span-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Sub-Space Link (Phone)</label>
                    <input
                      {...register("phone")}
                      placeholder="+X XX XXXX XXXX"
                      className="w-full bg-surface-container-low border border-surface-container px-6 py-4 rounded-2xl text-on-surface font-medium focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-sm focus:shadow-xl focus:shadow-primary/5"
                    />
                    {errors.phone && <p className="text-error text-[9px] font-black uppercase tracking-widest ml-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tight">Final Verification</h2>
                  <p className="text-on-surface-variant text-sm font-medium opacity-60">Validate operational parameters before synchronizing with the central engine.</p>
                </div>

                <div className="bg-surface-container-low/50 rounded-3xl p-10 border border-surface-container space-y-6">
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Asset Specification</span>
                    <span className="text-on-surface font-black text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">description</span>
                      {selectedResume?.name}
                    </span>
                  </div>
                  <div className="h-px bg-surface-container/50" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Primary Signature</span>
                    <span className="text-on-surface font-black text-xs uppercase tracking-tighter italic">{watch("name")}</span>
                  </div>
                  <div className="h-px bg-surface-container/50" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Channel Frequency</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-on-surface font-black text-xs">{watch("email")}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-40">{watch("phone")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="relative flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center h-6 mt-1">
                      <input
                        {...register("terms")}
                        type="checkbox"
                        className="peer h-6 w-6 bg-surface-container-low border border-surface-container appearance-none rounded-lg checked:bg-primary transition-all duration-300 soft-scale"
                      />
                      <span className="material-symbols-outlined absolute inset-0 m-auto text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity scale-75 font-black">done</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-medium select-none leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                      I authorize the synchronization of my personal datasets. I acknowledge that these assets will undergo <span className="text-on-surface font-bold">Neural Evaluation</span> as per the GreenHire calibration protocols.
                    </span>
                  </label>
                  {errors.terms && <p className="text-error text-[9px] font-black uppercase tracking-widest mt-3 ml-10 animate-pulse">{errors.terms.message}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-12 border-t border-surface-container/50">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className={cn(
                "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all soft-scale",
                step === 1 ? "opacity-0 pointer-events-none" : "text-on-surface-variant hover:text-primary disabled:opacity-20"
              )}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Return Phase
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-gradient text-on-primary font-headline font-black px-12 py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 soft-scale shadow-2xl shadow-primary/20"
              >
                Proceed Calibration
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gradient text-on-primary font-headline font-black px-12 py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 soft-scale shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:grayscale transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    Commit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
