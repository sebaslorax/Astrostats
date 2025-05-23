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
       // Responsive grid: 1 col on mobile, 2 on md, 3 on lg
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card border-border transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <Skeleton className="h-6 w-3/4" />
               <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent className="pt-4"> {/* Added padding top */}
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" /> {/* Added margin bottom */}
            </CardContent>
             <CardFooter className="flex justify-end space-x-1 pt-4">
                <Skeleton className="h-9 w-9" /> {/* Adjusted size */}
                <Skeleton className="h-9 w-9" />
                {/* <Skeleton className="h-9 w-9" /> Edit button placeholder */}
                <Skeleton className="h-9 w-9" />
             </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return <p className="text-muted-foreground text-center mt-8 px-4">Aún no se han añadido jugadores a este equipo.</p>; // Translated and added padding
  }

  return (
     // Responsive grid: 1 col on mobile, 2 on md, 3 on lg
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player) => (
        <Card key={player.id} className="bg-card border-border transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20 flex flex-col justify-between">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
             <div className="flex-1 mr-4">
                <CardTitle className="text-lg font-semibold truncate text-foreground">{player.firstName} {player.lastName}</CardTitle>
                 {/* Wrapped description in a div for potential overflow handling */}
                 <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                     <CardDescription className="text-xs text-muted-foreground">
                       Edad: {calculateAge(player.dob) ?? 'N/A'} | {player.sex?.substring(0,1) ?? 'N/A'} | A:{player.height || 'N/A'} | P:{player.weight || 'N/A'} {/* Abbreviated labels */}
                    </CardDescription>
                 </div>
             </div>
            <UserIcon className="h-6 w-6 text-accent flex-shrink-0" /> {/* Prevent icon shrinking */}
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            {/* Maybe show last test date or a mini chart preview here later */}
             <p className="text-sm text-muted-foreground">
                Pruebas Saltos: {player.jumpData?.length || 0} {/* Translated Abbreviated */}
             </p>
          </CardContent>
           <CardFooter className="flex justify-end space-x-1 pt-4">
              {/* Add Jump Data Button/Dialog Trigger */}
              <AddJumpDataDialog player={player} />

              <Link href={`/players/${player.id}`}> {/* Removed passHref */}
                 {/* Adjusted button size */}
                <Button size="icon" variant="ghost" title="Ver Detalles del Jugador" className="h-9 w-9"> {/* Translated */}
                  <Eye className="h-5 w-5" /> {/* Slightly larger icon */}
                </Button>
              </Link>
              {/* <Button size="icon" variant="ghost" title="Editar Jugador" disabled className="h-9 w-9"> <Edit className="h-5 w-5" /> </Button> */} {/* Translated title */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   {/* Adjusted button size */}
                   <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9" title="Eliminar Jugador"> {/* Translated */}
                    <Trash2 className="h-5 w-5" /> {/* Slightly larger icon */}
                  </Button>
                </AlertDialogTrigger>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle> {/* Translated */}
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente al jugador "{player.firstName} {player.lastName}" y todos sus datos de prueba. {/* Translated */}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel> {/* Translated */}
                      <AlertDialogAction onClick={() => removePlayer(player.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Eliminar Jugador {/* Translated */}
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
