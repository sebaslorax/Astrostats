"use client";

import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAstroStore, useHasHydrated } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayerJumpChart } from '@/components/players/PlayerJumpChart';
import { calculateAge } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AddJumpDataDialog } from '@/components/players/AddJumpDataDialog'; // Import dialog

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params?.playerId as string;

  const hasHydrated = useHasHydrated();
  // Fetch player details using the store *after* hydration
  const player = useAstroStore((state) => state.players.find(p => p.id === playerId));
  const team = useAstroStore((state) => state.teams.find(t => t.id === player?.teamId)); // Find team


  // Handle loading state
  if (!hasHydrated || !playerId) {
    return (
      <MainLayout>
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-10 w-1/6 mb-6" />
        <Separator className="mb-8" />
        {/* Updated grid layout for skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-1">
                <CardHeader>
                     <Skeleton className="h-6 w-3/4 mb-2" />
                     <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
           </Card>
            <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </MainLayout>
    );
  }

  // Handle player not found after hydration
  if (!player && hasHydrated) {
    return (
        <MainLayout>
             <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver {/* Translated */}
            </Button>
            <h1 className="text-2xl font-bold text-destructive">Jugador no encontrado</h1> {/* Translated */}
            <p className="text-muted-foreground">El jugador solicitado no existe.</p> {/* Translated */}
        </MainLayout>
    );
  }

   // Render player details and chart
   return (
    <MainLayout>
      <Button
         variant="ghost"
         onClick={() => router.push(player?.teamId ? `/teams/${player.teamId}` : '/')}
         className="mb-4 text-accent hover:text-accent-foreground hover:bg-accent/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a {team?.name || 'Equipo'} {/* Translated */}
      </Button>
       {/* Responsive header: stack on small screens, space-between on larger */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {player?.firstName} {player?.lastName}
          </h1>
          {/* Add Jump Data button next to the name */}
          {player && <AddJumpDataDialog player={player} />}
       </div>
       <Separator className="mb-8 bg-border/50" />

      {/* Responsive grid for content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Player Info Card */}
         <Card className="lg:col-span-1 bg-card border-border self-start">
            <CardHeader>
                <CardTitle>Detalles del Jugador</CardTitle> {/* Translated */}
                <CardDescription className="text-sm">Información actual registrada.</CardDescription> {/* Translated, smaller text */}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
               <p><strong>Equipo:</strong> {team?.name || 'N/A'}</p> {/* Translated */}
               <p><strong>Fecha de Nacimiento:</strong> {player?.dob ? new Date(player.dob).toLocaleDateString('es-ES') : 'N/A'} ({calculateAge(player?.dob) ?? 'N/A'} años)</p> {/* Translated, added Spanish locale */}
               <p><strong>Sexo:</strong> {player?.sex || 'N/A'}</p>
               <p><strong>Altura:</strong> {player?.height ? `${player.height} cm` : 'N/A'}</p> {/* Translated */}
               <p><strong>Peso:</strong> {player?.weight ? `${player.weight} kg` : 'N/A'}</p> {/* Translated */}
               <p><strong>ID Jugador:</strong> <span className="break-all">{player?.id.substring(0, 8)}...</span></p> {/* Translated, allow word break */}
                 {/* Edit Button could go here */}
            </CardContent>
         </Card>

         {/* Jump Data Chart */}
         <div className="lg:col-span-2">
             {player?.jumpData && <PlayerJumpChart jumpData={player.jumpData} />}
         </div>
      </div>
    </MainLayout>
  );
}


// Add generateStaticParams if you want to pre-render player pages (optional)
// export async function generateStaticParams() {
//   // Fetch all player IDs during build time
//   // Requires accessing data source - For now, empty array due to localStorage
//   return [];
// }
