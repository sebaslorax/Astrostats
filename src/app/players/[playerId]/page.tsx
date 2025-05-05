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
        <div className="grid md:grid-cols-3 gap-6">
           <Card className="md:col-span-1">
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
            <div className="md:col-span-2">
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
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-destructive">Player not found</h1>
            <p className="text-muted-foreground">The requested player does not exist.</p>
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
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to {team?.name || 'Team'}
      </Button>
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {player?.firstName} {player?.lastName}
          </h1>
          {/* Add Jump Data button next to the name */}
          {player && <AddJumpDataDialog player={player} />}
       </div>
       <Separator className="mb-8 bg-border/50" />

      <div className="grid md:grid-cols-3 gap-8">
         {/* Player Info Card */}
         <Card className="md:col-span-1 bg-card border-border self-start">
            <CardHeader>
                <CardTitle>Player Details</CardTitle>
                <CardDescription>Current information on record.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
               <p><strong>Team:</strong> {team?.name || 'N/A'}</p>
               <p><strong>Date of Birth:</strong> {player?.dob ? new Date(player.dob).toLocaleDateString() : 'N/A'} ({calculateAge(player?.dob) ?? 'N/A'} years)</p>
               <p><strong>Sex:</strong> {player?.sex || 'N/A'}</p>
               <p><strong>Height:</strong> {player?.height ? `${player.height} cm` : 'N/A'}</p>
               <p><strong>Weight:</strong> {player?.weight ? `${player.weight} kg` : 'N/A'}</p>
               <p><strong>Player ID:</strong> {player?.id.substring(0, 8)}...</p>
                 {/* Edit Button could go here */}
            </CardContent>
         </Card>

         {/* Jump Data Chart */}
         <div className="md:col-span-2">
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
