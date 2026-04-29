"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SettingsContentProps {
  user: {
    googleEmail: string | null;
    googleAccessToken: string | null;
  } | null;
}

export function SettingsContent({ user }: SettingsContentProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const isConnected = !!user?.googleAccessToken;

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Google account? This will disable automated interview scheduling.")) {
      return;
    }

    setIsDisconnecting(true);
    const toastId = toast.loading("Disconnecting Google account...");

    try {
      const response = await fetch("/api/google/disconnect", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Google account disconnected successfully", { id: toastId });
        window.location.reload();
      } else {
        const error = await response.text();
        toast.error(`Failed to disconnect: ${error}`, { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnect = () => {
    window.location.href = "/api/google/connect";
  };

  const handleReconnect = () => {
    if (confirm("This will disconnect your current account and start a new connection flow. Proceed?")) {
        handleDisconnect().then(() => {
            handleConnect();
        });
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-8 md:p-10 border-b border-surface-container/20 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/5">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface uppercase">Google Workspace</h2>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60">Calendar & Meet Integration</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isConnected ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container-high text-on-surface-variant opacity-50'}`}>
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-8">
        {isConnected ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-2 p-6 bg-surface-container-low border border-surface-container/30 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">Authenticated Email</span>
              <span className="text-lg font-bold text-on-surface">{user?.googleEmail || "Not specified"}</span>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleReconnect}
                disabled={isDisconnecting}
                className="px-8 h-14 bg-surface-container-high text-on-surface font-headline font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-surface-container transition-all soft-scale border border-surface-container/30 disabled:opacity-50"
              >
                Switch Account
              </button>
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="px-8 h-14 bg-error/10 text-error font-headline font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-error/20 transition-all soft-scale border border-error/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isDisconnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <span className="material-symbols-outlined text-sm">link_off</span>}
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center space-y-6">
            <div className="w-20 h-20 bg-surface-container-low rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-20">cloud_off</span>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">No Active Connection</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Connect your Google Workspace account to enable interview synchronization and automatic Google Meet link generation for your recruitment process.
              </p>
            </div>
            <button
              onClick={handleConnect}
              className="px-10 h-16 btn-gradient text-on-primary rounded-2xl font-headline font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 mx-auto soft-scale shadow-xl shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
              Connect Google Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
