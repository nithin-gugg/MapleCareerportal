'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,hsl(var(--surface-container-low))_0%,hsl(var(--surface))_100%)]">
      <div className="w-full max-w-md">
        {/* Brand Logo / Identity */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container mb-4 shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-on-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
          <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface">
            TalentFlow <span className="text-primary">Admin</span>
          </h1>
          <p className="mt-2 text-on-surface-variant font-body text-sm font-medium tracking-tight">Precision Vitality in Workforce Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest p-10 rounded-2xl no-border-card relative overflow-hidden group">
          {/* Decorative subtle texture */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
          
          {error && (
            <div className="mb-6 p-4 text-xs font-bold text-error bg-error-container/10 border border-error/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label 
                className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]" 
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within/input:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">alternate_email</span>
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  disabled={isLoading}
                  className="block w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary-fixed/40 transition-all text-sm font-medium"
                  placeholder="name@talentflow.io"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label 
                  className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]" 
                  htmlFor="password"
                >
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold text-primary hover:underline transition-all">Forgot Access?</a>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within/input:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  disabled={isLoading}
                  className="block w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary-fixed/40 transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-gradient text-on-primary font-headline font-black py-4 rounded-xl soft-scale shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
              >
                {isLoading ? (
                   <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <>
                    <span>Secure Access</span>
                    <span className="material-symbols-outlined text-lg">login</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-surface-container flex flex-col items-center space-y-4">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Internal administrative use only</p>
            <div className="flex space-x-6">
              <button className="flex items-center space-x-2 text-[10px] font-bold text-outline hover:text-on-surface transition-colors uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">help_center</span>
                <span>Help</span>
              </button>
              <button className="flex items-center space-x-2 text-[10px] font-bold text-outline hover:text-on-surface transition-colors uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">language</span>
                <span>Status</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-[10px] text-outline-variant leading-relaxed font-medium">
            By continuing, you agree to TalentFlow&apos;s Internal Policy and Security protocols. Unauthorized access attempts are monitored and recorded.
          </p>
        </div>
      </div>
    </main>
  );
}
