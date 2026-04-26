import { Container } from "@/components/Container";

export default function LoadingJobDetails() {
  return (
    <div className="bg-surface min-h-screen text-on-surface pb-32 relative overflow-hidden">
      <div className="border-b border-surface-container/20 bg-surface-container-low/10 sticky top-0 z-20 h-16" />
      <Container className="pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
          <section className="space-y-16">
            <div className="space-y-8 animate-pulse">
              <div className="w-32 h-8 bg-surface-container-high/50 rounded-lg" />
              <div className="w-3/4 h-20 bg-surface-container-high/50 rounded-2xl" />
              <div className="flex flex-wrap gap-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-surface-container-high/50" />
                   <div className="flex flex-col gap-2">
                      <div className="w-24 h-3 bg-surface-container-high/50 rounded" />
                      <div className="w-32 h-4 bg-surface-container-high/50 rounded" />
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-surface-container-high/50" />
                   <div className="flex flex-col gap-2">
                      <div className="w-24 h-3 bg-surface-container-high/50 rounded" />
                      <div className="w-40 h-4 bg-surface-container-high/50 rounded" />
                   </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 animate-pulse">
               <div className="w-1/3 h-10 bg-surface-container-high/50 rounded-xl" />
               <div className="space-y-4">
                  <div className="w-full h-4 bg-surface-container-high/50 rounded" />
                  <div className="w-full h-4 bg-surface-container-high/50 rounded" />
                  <div className="w-5/6 h-4 bg-surface-container-high/50 rounded" />
                  <div className="w-4/6 h-4 bg-surface-container-high/50 rounded" />
               </div>
            </div>
          </section>
          <aside className="space-y-10 animate-pulse">
            <div className="p-10 bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] h-96" />
            <div className="p-8 bg-secondary/5 border border-secondary/10 rounded-[2rem] h-32" />
          </aside>
        </div>
      </Container>
    </div>
  );
}
