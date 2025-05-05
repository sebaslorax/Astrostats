import Link from 'next/link';
import { RocketIcon } from '@/components/icons/RocketIcon'; // Use custom icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <RocketIcon className="h-6 w-6 text-primary" /> {/* Use custom icon */}
          <span className="font-bold sm:inline-block text-foreground">
            AstroStats {/* Keep brand name */}
          </span>
        </Link>
        {/* Add navigation or user controls here if needed in the future */}
      </div>
    </header>
  );
}
