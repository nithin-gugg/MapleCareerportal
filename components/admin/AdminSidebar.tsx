'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Candidates', href: '/admin/applications', icon: 'group' }, // Mapping 'Candidates' to 'applications' route locally
  { label: 'Job Postings', href: '/admin/jobs', icon: 'work' },
  { label: 'Interviews', href: '/admin/interviews', icon: 'event_available' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'bar_chart' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
];

export function AdminSidebar({ user, logoutAction }: { user?: any, logoutAction: any }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-surface-container-low flex flex-col border-r border-surface-container/30 z-50">
      <div className="px-8 py-10">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center soft-scale">
            <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-xl tracking-tighter text-on-surface leading-none">TalentFlow</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-70">Admin Console</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-headline text-sm font-bold transition-all soft-scale",
                isActive 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 space-y-2">
        <div className="bg-surface-container px-4 py-4 rounded-2xl flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
            JD
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-on-surface truncate">Admin User</span>
            <span className="text-[10px] text-on-surface-variant truncate">Maple HRMS v1.0</span>
          </div>
        </div>
        
        <form action={logoutAction}>
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-headline text-sm font-bold text-error hover:bg-error-container/10 transition-all soft-scale"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
