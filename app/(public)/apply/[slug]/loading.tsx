import { Container } from "@/components/Container";

export default function LoadingApplyPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface py-24 relative overflow-hidden">
      <Container className="max-w-3xl relative z-10 animate-pulse">
        <div className="w-48 h-6 bg-surface-container-high/50 rounded mb-12" />
        
        <div className="mb-16 space-y-4">
          <div className="w-40 h-8 bg-surface-container-high/50 rounded-lg" />
          <div className="w-3/4 h-16 bg-surface-container-high/50 rounded-2xl" />
          <div className="w-full h-16 bg-surface-container-high/50 rounded-xl" />
        </div>

        <div className="bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] p-8 h-[600px] shadow-2xl shadow-black/[0.02]" />
      </Container>
    </div>
  );
}
