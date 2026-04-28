import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <Container className="max-w-xl text-center space-y-10">
        <div className="space-y-4">
          <h1 className="font-headline text-8xl font-black tracking-tighter text-primary/20">404</h1>
          <h2 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tight">
            Operational Slot Not Found
          </h2>
          <p className="text-on-surface-variant font-medium opacity-60">
            The requested recruitment protocol has either been deprecated or never existed in the active pipeline.
          </p>
        </div>
        
        <Link href="/jobs">
          <button className="btn-gradient px-10 py-4 rounded-2xl text-on-primary font-headline font-black uppercase tracking-widest text-[10px] soft-scale shadow-xl shadow-primary/20">
            Return to Operational Inventory
          </button>
        </Link>
      </Container>
    </div>
  );
}
