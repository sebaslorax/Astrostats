import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Updated import
import { GeistMono } from 'geist/font/mono'; // Updated import
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

// Correctly reference the font objects
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'AstroStats',
  description: 'Futuristic Soccer Player Performance Tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Apply dark theme class */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable, // Use the variable property provided by the font object
          geistMono.variable // Use the variable property provided by the font object
        )}
      >
        {children}
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
