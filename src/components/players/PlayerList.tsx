"use client";

import Link from 'next/link';
import { useAstroStore, useAstroActions, useHasHydrated } from '@/lib/store';
import type { Player } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Edit, Eye, BarChartHorizontalBig } from 'lucide-react'; // Icons
import { UserIcon } from '@/components/icons/UserIcon'; // Custom Icon
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddJumpDataDialog } from './AddJumpDataDialog'; // Import the new dialog
import { calculateAge } from '@/lib/utils'; // Import utility function

interface PlayerListProps {
  teamId: string;
}

export function PlayerList({ teamId }: PlayerListProps) {
  // Fetch players specifically for this team
  const players = useAstroStore((state) => state.players.filter(p => p.teamId === teamId));
  const { removePlayer } = useAstroActions();
  const hasHydrated = useHasHydrated();

   // Handle loading state before hydration or if players is undefined
  if (!hasHydrated || players === undefined) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card border-border transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <Skeleton className="h-6 w-3/4" />
               <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
             <CardFooter className="flex justify-end space-x-2 pt-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
             </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return <p className="text-muted-foreground text-center mt-8">No players added to this team yet.</p>;
  }

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player) => (
        <Card key={player.id} className="bg-card border-border transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20 flex flex-col justify-between">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
             <div className="flex-1 mr-4">
                <CardTitle className="text-lg font-semibold truncate text-foreground">{player.firstName} {player.lastName}</CardTitle>
                 <CardDescription className="text-xs text-muted-foreground">
                   Age: {calculateAge(player.dob) ?? 'N/A'} | {player.sex} | H: {player.height || 'N/A'}cm | W: {player.weight || 'N/A'}kg
                </CardDescription>
             </div>
            <UserIcon className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            {/* Maybe show last test date or a mini chart preview here later */}
             <p className="text-sm text-muted-foreground">
                Jump Tests Recorded: {player.jumpData?.length || 0}
             </p>
          </CardContent>
           <CardFooter className="flex justify-end space-x-1 pt-4">
              {/* Add Jump Data Button/Dialog Trigger */}
              <AddJumpDataDialog player={player} />

              <Link href={`/players/${player.id}`} passHref>
                <Button size="icon" variant="ghost" title="View Player Details">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              {/* <Button size="icon" variant="ghost" title="Edit Player" disabled> <Edit className="h-4 w-4" /> </Button> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete Player">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the player "{player.firstName} {player.lastName}" and all their test data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removePlayer(player.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Player
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
           </CardFooter>
        </Card>
      ))}
    </div>
  );
}
