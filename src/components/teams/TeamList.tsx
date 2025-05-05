"use client";

import Link from 'next/link';
import { useAstroStore, useAstroActions, useHasHydrated } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trash2, Edit } from 'lucide-react'; // Icons for delete/edit
import { UserGroupIcon } from '@/components/icons/UserGroupIcon'; // Custom Icon
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
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { useToast } from '@/hooks/use-toast';


export function TeamList() {
  const teams = useAstroStore((state) => state.teams);
  const { removeTeam, updateTeam } = useAstroActions();
  const hasHydrated = useHasHydrated();
  const [editingTeam, setEditingTeam] = useState<{ id: string; name: string } | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const { toast } = useToast();

  const handleEditClick = (team: { id: string; name: string }) => {
    setEditingTeam(team);
    setNewTeamName(team.name);
  };

  const handleSaveEdit = () => {
    if (editingTeam && newTeamName.trim()) {
      updateTeam(editingTeam.id, newTeamName.trim());
      toast({ title: "Éxito", description: "Nombre del equipo actualizado." }); // Translated
      setEditingTeam(null);
      setNewTeamName('');
    } else if (!newTeamName.trim()){
       toast({ title: "Error", description: "El nombre del equipo no puede estar vacío.", variant: "destructive" }); // Translated
    }
  };


  if (!hasHydrated || teams === undefined) {
    // Show skeleton loaders while waiting for hydration or if teams is undefined
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-card border-border transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-2 mt-4">
                <Skeleton className="h-8 w-16" />
                 <Skeleton className="h-8 w-8" />
                 <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return <p className="text-muted-foreground text-center mt-8">Aún no se han creado equipos. ¡Añade un equipo para empezar!</p>; // Translated
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="bg-card border-border transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex-1 mr-4">
                 <CardTitle className="text-lg font-semibold truncate text-foreground">{team.name}</CardTitle>
                 <CardDescription className="text-xs text-muted-foreground">ID Equipo: {team.id.substring(0, 8)}...</CardDescription> {/* Translated */}
              </div>
              <UserGroupIcon className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent className="pt-4">
              {/* Add more team details here later if needed, like player count */}
              <div className="flex space-x-2 mt-auto">
                 <Link href={`/teams/${team.id}`} passHref>
                    <Button size="sm" variant="outline" className="flex-1">Ver Jugadores</Button> {/* Translated */}
                 </Link>
                <Button size="sm" variant="ghost" onClick={() => handleEditClick(team)} aria-label="Editar Equipo"> {/* Translated */}
                   <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Eliminar Equipo"> {/* Translated */}
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle> {/* Translated */}
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo "{team.name}" y todos los datos de jugadores asociados. {/* Translated */}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel> {/* Translated */}
                      <AlertDialogAction onClick={() => removeTeam(team.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Eliminar Equipo {/* Translated */}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

       {/* Edit Team Dialog */}
      <Dialog open={!!editingTeam} onOpenChange={(isOpen) => !isOpen && setEditingTeam(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Editar Nombre del Equipo</DialogTitle> {/* Translated */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-team-name" className="text-right">
                Nombre {/* Translated */}
              </Label>
              <Input
                id="edit-team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="col-span-3"
                placeholder="Introduce el nuevo nombre del equipo" // Translated
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setEditingTeam(null)}>Cancelar</Button> {/* Translated */}
            </DialogClose>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button> {/* Translated */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
