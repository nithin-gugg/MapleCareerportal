import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maple HRMS | TalentFlow',
  description: 'Precision Vitality in Workforce Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", inter.variable, manrope.variable)}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className={cn(inter.className, "min-h-screen flex flex-col bg-background text-foreground tracking-tight")}>
        {children}
        {/* Global toast notifications — updated to match GreenHire theme */}
        <Toaster
          position="bottom-right"
          richColors
          theme="light"
          toastOptions={{
            style: {
              background: 'hsl(var(--surface-container-lowest))',
              border: 'none',
              color: 'hsl(var(--on-surface))',
              fontFamily: 'var(--font-inter)',
              boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.04)',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  );
}
