"use client"; // Required because we use hooks (useParams, useAstroStore)

import { useParams, useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { MainLayout } from '@/components/layout/MainLayout';
import { PlayerList } from '@/components/players/PlayerList';
import { AddPlayerDialog } from '@/components/players/AddPlayerDialog';
import { useAstroStore, useHasHydrated } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.teamId as string; // Get teamId from URL params

  const hasHydrated = useHasHydrated();
  // Fetch team details using the store *after* hydration
  const team = useAstroStore((state) => state.teams.find(t => t.id === teamId));

  // Handle cases before hydration or if team not found
  if (!hasHydrated || !teamId) {
    // Show loading state or redirect if ID is missing
    return (
      <MainLayout>
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-10 w-1/6 mb-6" />
        <Separator className="mb-8" />
        <Skeleton className="h-64 w-full" />
      </MainLayout>
    );
  }

  // Optional: Handle team not found after hydration
   if (!team && hasHydrated) {
      return (
          <MainLayout>
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Equipos {/* Translated */}
              </Button>
              <h1 className="text-2xl font-bold text-destructive">Equipo no encontrado</h1> {/* Translated */}
              <p className="text-muted-foreground">El equipo solicitado no existe.</p> {/* Translated */}
          </MainLayout>
      );
  }

  // Only render the main content if team is found and component has hydrated
  return (
    <MainLayout>
       <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 text-accent hover:text-accent-foreground hover:bg-accent/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Todos los Equipos {/* Translated */}
      </Button>
      {/* Responsive header: stack on small screens, space-between on larger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {team?.name || <Skeleton className="h-8 w-48 inline-block" />} {/* Show skeleton if team name is loading */}
        </h1>
        {teamId && <AddPlayerDialog teamId={teamId} />} {/* Render AddPlayerDialog only if teamId exists */}
      </div>
      <Separator className="mb-8 bg-border/50" />
      {teamId && <PlayerList teamId={teamId} />} {/* Render PlayerList only if teamId exists */}
    </MainLayout>
  );
}

// Add generateStaticParams if you want to pre-render team pages (optional)
// export async function generateStaticParams() {
//   // Fetch all team IDs during build time
//   // This requires accessing your data source (e.g., local file, API)
//   // For now, we'll return an empty array as data is in localStorage client-side
//   return [];
// }
