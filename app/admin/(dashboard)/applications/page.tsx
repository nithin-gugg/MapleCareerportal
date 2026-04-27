import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata = {
  title: "Candidates | Maple HRMS",
  description: "Browse all candidate applications in the Maple HRMS talent pipeline.",
};

// ── Score ring color helper ────────────────────────────────────────────────────
function getScoreColor(score: number | null): string {
  if (score === null) return "text-on-surface-variant opacity-40";
  if (score >= 75) return "text-[#00dc82]";
  if (score >= 50) return "text-yellow-500";
  return "text-red-400";
}

function getScoreRingColor(score: number | null): string {
  if (score === null) return "#e8e8e8";
  if (score >= 75) return "#00dc82";
  if (score >= 50) return "#eab308";
  return "#f87171";
}

// ── Stage dot color ────────────────────────────────────────────────────────────
const stageColors: Record<string, string> = {
  APPLIED:    "bg-zinc-400",
  ASSESSMENT: "bg-yellow-400",
  INTERVIEW1: "bg-orange-400",
  INTERVIEW2: "bg-orange-500",
  OFFER:      "bg-purple-400",
};

// ── Candidate Card ─────────────────────────────────────────────────────────────
function CandidateCard({ app }: { app: any }) {
  const score = app.score !== null ? Math.round(app.score) : null;
  const scoreRadius = 28;
  const circumference = 2 * Math.PI * scoreRadius;
  const strokeDashoffset = score !== null
    ? circumference - (score / 100) * circumference
    : circumference;

  const initials = app.name
    .split(" ")
    .map((n: string) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  // Random-ish but deterministic avatar gradient based on name char codes
  const hue = (app.name.charCodeAt(0) * 37 + (app.name.charCodeAt(1) || 0) * 13) % 360;

  return (
    <Link
      href={`/admin/applications/${app.id}`}
      className="group relative bg-surface-container-lowest border border-surface-container/30 rounded-3xl p-7 flex flex-col gap-5 shadow-sm hover:shadow-xl hover:shadow-black/[0.06] hover:border-primary/20 transition-all duration-300 soft-scale overflow-hidden"
    >
      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header row: avatar + score ring */}
      <div className="flex items-start justify-between gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-headline font-black text-xl shadow-lg shrink-0"
          style={{ background: `hsl(${hue}, 60%, 45%)` }}
        >
          {initials}
        </div>

        {/* Score ring */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 72 72">
              {/* Track */}
              <circle
                cx="36" cy="36" r={scoreRadius}
                fill="none"
                stroke="#e8e8e8"
                strokeWidth="5"
              />
              {/* Progress */}
              <circle
                cx="36" cy="36" r={scoreRadius}
                fill="none"
                stroke={getScoreRingColor(score)}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[11px] font-black ${getScoreColor(score)}`}>
                {score !== null ? `${score}%` : "—"}
              </span>
            </div>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">
            AI Score
          </span>
        </div>
      </div>

      {/* Name + email */}
      <div className="space-y-1 min-w-0">
        <h2 className="font-headline text-lg font-black text-on-surface tracking-tight truncate group-hover:text-primary transition-colors">
          {app.name}
        </h2>
        <p className="text-[11px] font-medium text-on-surface-variant opacity-60 truncate">
          {app.email}
        </p>
      </div>

      {/* Role applied */}
      <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container/40">
        <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          work
        </span>
        <span className="text-[11px] font-black text-on-surface truncate">{app.job.title}</span>
      </div>

      {/* Stage + Status row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Stage pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full border border-surface-container/50">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stageColors[app.stage] || "bg-zinc-400"}`} />
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
            {app.stage.replace("INTERVIEW", "Round ")}
          </span>
        </div>

        {/* Status badge */}
        <StatusBadge status={app.status} />
      </div>

      {/* Footer: date + arrow */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-container/30">
        <span className="text-[10px] font-bold text-on-surface-variant opacity-40 italic">
          {new Date(app.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="material-symbols-outlined text-base text-on-surface-variant opacity-30 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function CandidatesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [applications, stats] = await Promise.all([
    db.application.findMany({
      include: { job: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.application.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const totalCount = applications.length;
  const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
  const avgScore =
    applications.filter((a) => a.score !== null).length > 0
      ? Math.round(
          applications.reduce((sum, a) => sum + (a.score || 0), 0) /
            applications.filter((a) => a.score !== null).length
        )
      : null;

  return (
    <div className="p-6 md:p-10 space-y-10 min-h-screen">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              group
            </span>
          </div>
          <div>
            <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">
              Candidates
            </h1>
            <p className="text-on-surface-variant text-sm font-medium opacity-70">
              {totalCount} applicant{totalCount !== 1 ? "s" : ""} in the talent pipeline
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col items-center px-5 py-3 bg-surface-container-lowest rounded-2xl border border-surface-container/30 shadow-sm min-w-[80px]">
            <span className="text-2xl font-black text-on-surface tracking-tighter">{totalCount}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Total</span>
          </div>
          <div className="flex flex-col items-center px-5 py-3 bg-surface-container-lowest rounded-2xl border border-surface-container/30 shadow-sm min-w-[80px]">
            <span className="text-2xl font-black tracking-tighter" style={{ color: "#00dc82" }}>{shortlisted}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Shortlisted</span>
          </div>
          {avgScore !== null && (
            <div className="flex flex-col items-center px-5 py-3 bg-surface-container-lowest rounded-2xl border border-surface-container/30 shadow-sm min-w-[80px]">
              <span className="text-2xl font-black text-on-surface tracking-tighter">{avgScore}%</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Avg Score</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Cards Grid ──────────────────────────────────────────────────── */}
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8 text-center">
          <div className="w-24 h-24 rounded-3xl bg-surface-container-low flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-20">
              person_search
            </span>
          </div>
          <div className="space-y-2 max-w-sm">
            <h2 className="font-headline text-2xl font-black text-on-surface tracking-tight">
              No Candidates Yet
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed opacity-70">
              Applications will appear here once candidates submit through the public job portal.
            </p>
          </div>
          <Link
            href="/jobs"
            target="_blank"
            className="flex items-center gap-2 px-6 h-11 btn-gradient text-black font-headline font-black text-[10px] uppercase tracking-widest rounded-xl soft-scale shadow-lg shadow-accent/20"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            View Job Portal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app) => (
            <CandidateCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
