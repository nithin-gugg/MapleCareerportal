import React from 'react';
import { logoutAction } from '@/actions/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar logoutAction={logoutAction} />
      <main className="flex-1 ml-64 min-h-screen relative overflow-y-auto">
        {/* Added a subtle top gradient pulse for 'Precision Vitality' aesthetic */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
