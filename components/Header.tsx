"use client";

import React from 'react';
import { Container } from './Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full backdrop-blur-xl transition-all duration-500",
      isHome 
        ? "bg-[#051f18]/80 border-b border-white/5" 
        : "bg-surface-container-lowest/80 border-b border-surface-container/20"
    )}>
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#00dc82] flex items-center justify-center soft-scale shadow-lg shadow-[#00dc82]/20">
               <span className="material-symbols-outlined text-[#051f18] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
            </div>
            <span className={cn(
              "font-headline font-black text-xl tracking-tighter transition-colors duration-500",
              isHome ? "text-white" : "text-on-surface"
            )}>
              Maple <span className="text-[#00dc82]">HIRE</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className={cn(
              "text-sm font-semibold transition-colors duration-500",
              isHome ? "text-white/60 hover:text-[#00dc82]" : "text-on-surface-variant hover:text-primary"
            )}>
              Browse Jobs
            </Link>
            <Link href="/about" className={cn(
              "text-sm font-semibold transition-colors duration-500",
              isHome ? "text-white/60 hover:text-[#00dc82]" : "text-on-surface-variant hover:text-primary"
            )}>
              Our Vision
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin" className={cn(
            "text-sm font-bold transition-colors duration-500",
            isHome ? "text-white/60 hover:text-white" : "text-on-surface-variant hover:text-on-surface"
          )}>
            Recruiter Login
          </Link>
          <Link 
            href="/jobs" 
            className="bg-[#00dc82] text-[#051f18] text-[10px] font-black px-6 py-2.5 rounded-xl soft-scale shadow-xl shadow-[#00dc82]/10 uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95"
          >
            Apply Now
          </Link>
        </div>
      </Container>
    </header>
  );
}
