import { Container } from '@/components/Container';

export default function HomePage() {
  return (
    <Container className="py-10 md:py-20">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Welcome to <span className="text-primary">Maple HRMS</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          A production-ready Next.js 14 HR Management System built with ShadCN UI, Tailwind CSS, and Prisma.
        </p>
      </div>
    </Container>
  );
}
