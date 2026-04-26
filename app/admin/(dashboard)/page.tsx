import { Container } from "@/components/Container";
import { db } from "@/lib/db";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Pagination } from "@/components/admin/Pagination";
import Link from "next/link";

interface AdminDashboardProps {
  searchParams: {
    page?: string;
    status?: string;
    jobId?: string;
    score?: string;
  };
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Build Filter
  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.jobId) where.jobId = searchParams.jobId;
  if (searchParams.score) where.score = { gte: parseFloat(searchParams.score) };

  // Fetch Data in Parallel
  const [applications, totalCount, jobs, stats] = await Promise.all([
    db.application.findMany({
      where,
      include: { job: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.application.count({ where }),
    db.job.findMany({ select: { id: true, title: true } }),
    db.application.aggregate({
      where,
      _avg: { score: true },
      _count: { id: true },
    }),
  ]);

  // Fetch Pending specifically for summary
  const pendingCount = await db.application.count({ where: { status: "PENDING" } });

  return (
    <div className="py-12 px-4 md:px-10 space-y-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-3xl">analytics</span>
             </div>
             <div>
                <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">Precision Dashboard</h1>
                <p className="text-on-surface-variant font-body text-sm font-medium">Monitoring Talent Ecosystem v1.2</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
          <div className="bg-surface-container-lowest p-6 rounded-2xl soft-scale shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Total Intake</span>
               <span className="material-symbols-outlined text-primary text-xl">group</span>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tighter">{stats._count.id}</p>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
               <div className="h-full bg-primary w-full opacity-30" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl soft-scale shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Awaiting Review</span>
               <span className="material-symbols-outlined text-secondary text-xl">pending_actions</span>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tighter">{pendingCount}</p>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
               <div className="h-full bg-secondary transition-all" style={{ width: `${(pendingCount / (stats._count.id || 1)) * 100}%` }} />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl soft-scale shadow-sm hidden lg:flex flex-col gap-2">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Quality Index</span>
               <span className="material-symbols-outlined text-accent text-xl">star</span>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tighter">
              {stats._avg.score ? Math.round(stats._avg.score) : 0}%
            </p>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
               <div className="h-full bg-accent transition-all" style={{ width: `${stats._avg.score || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h2 className="font-headline text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">dynamic_feed</span>
              Recent Activity
           </h2>
           <AdminFilters jobs={jobs} />
        </div>

        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-surface-container/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Candidate Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">AI Scoring</th>
                  <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Current Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Applied Pipeline</th>
                  <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/30">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="group hover:bg-primary-container/20 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-left">
                          <Link href={`/admin/applications/${app.id}`} className="group/link flex items-center gap-2">
                            <span className="text-sm font-black text-on-surface group-hover/link:text-primary transition-colors tracking-tight">
                              {app.name}
                            </span>
                            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/link:opacity-100 transition-all transform translate-x-[-4px] group-hover/link:translate-x-0">arrow_forward</span>
                          </Link>
                          <span className="text-[11px] text-on-surface-variant font-medium tracking-tight">{app.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-2 min-w-[120px]">
                          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden max-w-[100px]">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_rgba(0,181,135,0.4)]" 
                              style={{ width: `${app.score || 0}%` }} 
                            />
                          </div>
                          <span className="text-[11px] font-black text-on-surface tracking-widest">{Math.round(app.score || 0)}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge status={app.status} />
                          <div className="flex items-center gap-1 opacity-50 px-2">
                             <span className="w-1 h-1 rounded-full bg-on-surface-variant" />
                             <span className="text-[9px] font-black uppercase tracking-widest">{app.stage}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-[11px] font-black text-on-surface uppercase tracking-tighter leading-tight">{app.job.title}</span>
                           <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest leading-none">Internal Posting</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[11px] font-bold text-on-surface-variant tracking-tight italic opacity-60">
                           {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <a 
                          href={app.resumeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-primary transition-all soft-scale group/cv"
                        >
                          <span className="material-symbols-outlined text-xl">description</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center text-outline/30 animate-pulse">
                          <span className="material-symbols-outlined text-5xl">folder_off</span>
                        </div>
                        <div className="flex flex-col gap-1">
                           <p className="text-on-surface font-black text-lg tracking-tighter">No Active Protocols</p>
                           <p className="text-on-surface-variant text-sm font-medium">Your filter parameters returned zero ingestion records.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-surface-container-lowest/50 border-t border-surface-container/30 px-8 py-4">
             <Pagination totalItems={totalCount} pageSize={pageSize} />
          </div>
        </div>
      </div>
    </div>
  );
}
