import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-12 px-4 md:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
