import Link from 'next/link';
import { RocketIcon } from '@/components/icons/RocketIcon'; // Use custom icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Adjusted container padding for mobile */}
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <RocketIcon className="h-6 w-6 text-primary" /> {/* Use custom icon */}
          {/* Responsive text size for brand name */}
          <span className="font-bold text-base sm:text-lg text-foreground">
            AstroStats {/* Keep brand name */}
          </span>
        </Link>
        {/* Add navigation or user controls here if needed in the future */}
        {/* Example: Could add a mobile menu trigger here */}
        {/* <div className="ml-auto md:hidden"> ... mobile menu button ... </div> */}
        {/* <nav className="ml-auto hidden md:flex"> ... desktop nav ... </nav> */}
      </div>
    </header>
  );
}
