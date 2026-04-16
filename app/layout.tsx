import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maple HRMS',
  description: 'Production-ready Next.js 14 application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={cn(inter.className, "min-h-screen flex flex-col bg-background text-foreground antialiased")}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
