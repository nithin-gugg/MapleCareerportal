import { Container } from "@/components/Container";

export default function LoadingJobs() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Hero Section Skeleton */}
      <section className="py-24 border-b border-surface-container/30 bg-surface-container-low/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <Container>
          <div className="max-w-3xl space-y-6">
            <div className="w-40 h-8 bg-surface-container-high/50 rounded-lg animate-pulse" />
            <div className="w-3/4 h-16 md:h-20 bg-surface-container-high/50 rounded-xl animate-pulse" />
            <div className="w-full h-24 bg-surface-container-high/50 rounded-xl animate-pulse" />
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-surface-container-high/50 animate-pulse" />
                 <div className="flex flex-col gap-2">
                    <div className="w-12 h-4 bg-surface-container-high/50 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-surface-container-high/50 rounded animate-pulse" />
                 </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Jobs Grid Skeleton */}
      <section className="py-24 relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] p-8 shadow-sm animate-pulse">
                <div className="flex flex-col h-full gap-4">
                    <div className="w-24 h-6 bg-surface-container-high/50 rounded-lg" />
                    <div className="w-full h-10 bg-surface-container-high/50 rounded-xl mt-2" />
                    <div className="w-full h-20 bg-surface-container-high/50 rounded-xl mt-4" />
                    <div className="flex gap-2 mt-auto">
                        <div className="w-20 h-6 bg-surface-container-high/50 rounded" />
                        <div className="w-20 h-6 bg-surface-container-high/50 rounded" />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
