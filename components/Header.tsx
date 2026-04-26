import React from 'react';
import { Container } from './Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container/20">
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center soft-scale">
               <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
            </div>
            <span className="font-headline font-black text-xl tracking-tighter text-on-surface">
              MapleEdge <span className="text-accent">HIRE</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Browse Jobs
            </Link>
            <Link href="/about" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Our Vision
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">
            Recruiter Login
          </Link>
          <Link 
            href="/jobs" 
            className="btn-gradient text-on-primary text-sm font-bold px-5 py-2.5 rounded-lg soft-scale shadow-sm"
          >
            Apply Now
          </Link>
        </div>
      </Container>
    </header>
  );
}
