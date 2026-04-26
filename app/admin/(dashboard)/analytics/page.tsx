import React from "react";
import { Container } from "@/components/Container";
import { getAnalyticsData } from "@/actions/analytics";
import { 
  FunnelChart, 
  ResolutionPieChart, 
  TrendAreaChart 
} from "@/components/admin/AnalyticsCharts";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  LayoutDashboard,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AnalyticsPage() {
  const result = await getAnalyticsData();

  if (!result.success || !result.metrics) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-white text-2xl font-black uppercase italic">Error loading analytics</h1>
        <p className="text-zinc-500 mt-4">{result.error}</p>
      </Container>
    );
  }

  const { metrics, funnelData, resolutionData, trendData } = result;

  return (
    <div className="py-12 px-4 md:px-10 space-y-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-on-surface-variant hover:text-primary uppercase tracking-[0.2em] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Operator Console
          </Link>
          <h1 className="font-headline text-5xl font-black tracking-tighter text-on-surface leading-none">
            Performance <span className="text-primary italic">Convergence</span>
          </h1>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            High-Fidelity Recruitment Metrics & Flow Analysis
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Intake" 
          value={metrics.totalApplications.toString()} 
          subValue={`${metrics.appGrowth >= 0 ? '↑' : '↓'} ${Math.abs(metrics.appGrowth)}% Deviation`}
          icon="group_add"
          trend={metrics.appGrowth >= 0 ? "up" : "down"}
        />
        <MetricCard 
          label="Quality Quotient" 
          value={`${metrics.avgScore}%`} 
          subValue="AI Match Fidelity Index"
          icon="psychometric_analysis"
        />
        <MetricCard 
          label="Processing Velocity" 
          value="4.2d" 
          subValue="Cycle Time to Interview"
          icon="speed"
        />
        <MetricCard 
          label="Pending Validation" 
          value={metrics.pendingReview.toString()} 
          subValue="Awaiting Recruiter Review"
          icon="fact_check"
          active
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Funnel */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl overflow-hidden group shadow-sm border border-surface-container/20 transition-all hover:shadow-xl hover:shadow-black/5">
          <div className="px-10 py-8 border-b border-surface-container/30 bg-surface-container-low/20 flex items-center justify-between">
            <h2 className="font-headline text-xl font-black tracking-tight text-on-surface">Ecosystem Conversion Funnel</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Live Flow</span>
            </div>
          </div>
          <div className="p-10">
            <FunnelChart data={funnelData} />
          </div>
        </div>

        {/* Resolution Breakdown */}
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden group shadow-sm border border-surface-container/20 transition-all hover:shadow-xl hover:shadow-black/5">
          <div className="px-10 py-8 border-b border-surface-container/30 bg-surface-container-low/20">
            <h2 className="font-headline text-xl font-black tracking-tight text-on-surface">Application Resolution</h2>
          </div>
          <div className="p-10 space-y-10">
            <ResolutionPieChart data={resolutionData} />
            <div className="grid grid-cols-2 gap-6">
              {resolutionData.map((item, i) => (
                <div key={i} className="space-y-1 relative pl-4">
                  <div className="absolute left-0 top-0 w-1 h-full rounded-full" style={{ backgroundColor: item.fill }} />
                  <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest opacity-60">
                    {item.name}
                  </p>
                  <p className="text-2xl font-black text-on-surface tracking-tighter">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historical Trends */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-3xl overflow-hidden group shadow-sm border border-surface-container/20 transition-all hover:shadow-xl hover:shadow-black/5">
          <div className="px-10 py-8 border-b border-surface-container/30 bg-surface-container-low/20 flex items-center justify-between">
            <h2 className="font-headline text-xl font-black tracking-tight text-on-surface">7-Day Trajectory Analysis</h2>
            <Link href="#" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1 hover:underline">
               Export Raw Data
               <span className="material-symbols-outlined text-xs">download</span>
            </Link>
          </div>
          <div className="p-10">
            <TrendAreaChart data={trendData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  subValue, 
  icon, 
  trend, 
  active 
}: { 
  label: string; 
  value: string; 
  subValue: string; 
  icon: string; 
  trend?: "up" | "down";
  active?: boolean;
}) {
  return (
    <div className={cn(
      "p-8 rounded-3xl relative group overflow-hidden transition-all duration-500 shadow-sm border border-surface-container/20 soft-scale",
      active ? "bg-primary-container/20" : "bg-surface-container-lowest hover:bg-surface-container-low"
    )}>
      {/* Decorative Blur */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700",
        active ? "bg-primary" : "bg-secondary"
      )} />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
           <div className={cn(
             "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
             active ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant group-hover:text-primary group-hover:bg-primary-container"
           )}>
             <span className="material-symbols-outlined text-2xl">{icon}</span>
           </div>
           {trend && (
             <span className={cn(
               "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
               trend === "up" ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
             )}>
               {trend === "up" ? "+12%" : "-4%"}
             </span>
           )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-primary transition-colors">
            {label}
          </p>
          <div className="flex flex-col gap-1">
            <h3 className="text-4xl font-black text-on-surface leading-none tracking-tighter">
              {value}
            </h3>
            <p className="text-[11px] font-bold text-on-surface-variant/60 tracking-tight leading-none italic uppercase">
              {subValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
