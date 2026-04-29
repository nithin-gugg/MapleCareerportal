import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { getJobBySlug } from "@/actions/jobs";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { JobBadge } from "@/components/JobBadge";

interface JobDetailsProps {
  params: {
    slug: string;
  };
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const { slug } = params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const skills = (Array.isArray(job.skills) ? job.skills : []) as string[];

  // Detect whether description is HTML (from RTE) or legacy plain text
  const isHtml = /<[a-z][\s\S]*>/i.test(job.description);

  return (
    <div className="bg-surface min-h-screen text-on-surface pb-32 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-secondary/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      {/* Navigation Breadcrumb */}
      <div className="border-b border-surface-container/20 bg-surface-container-low/10 sticky top-0 z-20 backdrop-blur-md">
        <Container>
          <div className="flex items-center gap-3 py-5">
            <Link
              href="/jobs"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
            >
              Jobs
            </Link>
            <span className="material-symbols-outlined text-sm text-outline/30">
              chevron_right
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary truncate">
              Role: {job.title}
            </span>
          </div>
        </Container>
      </div>

      <Container className="pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
          {/* Main Content */}
          <section className="space-y-16">
            <div className="space-y-8">
              <div className="inline-flex px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                {job.type || "Full-time"} Engagement
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-none text-on-surface uppercase">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-10">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shadow-sm transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-xl">
                      schedule
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">
                      Opened Date
                    </span>
                    <span className="text-sm font-black text-on-surface">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shadow-sm transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-xl">
                      location_on
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">
                      Location
                    </span>
                    <span className="text-sm font-black text-on-surface">
                      Hyderabad, Telangana
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Job Description ─────────────────────────────────────────── */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface uppercase">
                  Requirements
                </h2>
                <div className="flex-1 h-px bg-surface-container" />
              </div>

              {isHtml ? (
                /**
                 * Render rich HTML from the editor.
                 * `prose` class from @tailwindcss/typography gives beautiful
                 * out-of-the-box typography for headings, lists, links, etc.
                 * The overrides keep colours on-brand with GreenHire.
                 */
                <div
                  className="prose prose-neutral max-w-none jd-prose text-xl text-on-surface-variant font-inter leading-relaxed opacity-80"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              ) : (
                /* Legacy plain-text fallback */
                <div className="text-on-surface-variant font-medium leading-relaxed whitespace-pre-wrap text-xl max-w-3xl opacity-80 font-inter">
                  {job.description}
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-10">
            <div className="sticky top-32 p-10 bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] shadow-2xl shadow-black/[0.02]">
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-surface-container/30">
                <span className="material-symbols-outlined text-primary">
                  fact_check
                </span>
                <h3 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface">
                  Application
                </h3>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2 mb-4">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-surface-container-low text-on-surface text-[10px] font-black uppercase tracking-widest rounded-xl border border-surface-container/30 transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-surface-container/30 space-y-6">
                  <Link href={`/apply/${job.slug}`}>
                    <button
                      id="apply-now-btn"
                      className="w-full btn-gradient py-6 rounded-2xl text-on-primary font-headline font-black uppercase tracking-[0.2em] text-xs soft-scale shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        login
                      </span>
                      Apply Now
                    </button>
                  </Link>
                  <p className="text-[9px] font-black text-on-surface-variant/40 text-center uppercase tracking-widest leading-relaxed">
                    Apply by submitting you resume and fill the details carefully. We will get back to you as soon as possible
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary/5 border border-secondary/10 rounded-[2rem] flex flex-col items-center text-center gap-4 group">
              <div className="w-12 h-12 bg-surface-container-lowest rounded-2xl flex items-center justify-center text-secondary shadow-sm transition-transform group-hover:rotate-12">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  diversity_3
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-secondary uppercase tracking-[0.1em]">
                  Employee Referrals
                </h4>
                <p className="text-[11px] font-medium text-on-surface-variant opacity-60 px-4">
                  If you have a friend who might be a good fit for this role, refer them to us.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
