import React from 'react';
import { Container } from './Container';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Maple HRMS</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Admin
          </Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Login
          </Link>
        </nav>
      </Container>
    </header>
  );
}
