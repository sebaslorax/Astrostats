import type { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
       {/* Adjusted container padding for mobile */}
      <main className="flex-1 container max-w-screen-2xl py-6 sm:py-8 px-4 sm:px-8">{children}</main>
       {/* Footer could be added here */}
       {/* <footer className="container max-w-screen-2xl py-4 border-t border-border/40 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} AstroStats
        </footer> */}
    </div>
  );
}
