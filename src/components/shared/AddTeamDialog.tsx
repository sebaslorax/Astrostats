"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAstroActions } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react'; // Use standard icon for add

export function AddTeamDialog() {
  const [teamName, setTeamName] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Control dialog open state
  const { addTeam } = useAstroActions();
  const { toast } = useToast();

  const handleAddTeam = () => {
    if (!teamName.trim()) {
      toast({
        title: "Error", // Translated
        description: "El nombre del equipo no puede estar vacío.", // Translated
        variant: "destructive",
      });
      return;
    }
    addTeam(teamName);
    toast({
      title: "Éxito", // Translated
      description: `Equipo "${teamName}" creado con éxito.`, // Translated
    });
    setTeamName(''); // Clear input
    setIsOpen(false); // Close dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nuevo Equipo {/* Translated */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Equipo</DialogTitle> {/* Translated */}
          <DialogDescription className="text-sm"> {/* Smaller description text */}
            Introduce el nombre para el nuevo equipo de fútbol. {/* Translated */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Updated grid layout for responsiveness */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
            <Label htmlFor="team-name" className="sm:text-right">
              Nombre Equipo {/* Translated */}
            </Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="col-span-1 sm:col-span-3" // Adjusted column span
              placeholder="ej., Galactic Strikers" // Translated placeholder
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button variant="outline">Cancelar</Button> {/* Translated */}
          </DialogClose>
          <Button onClick={handleAddTeam}>Crear Equipo</Button> {/* Translated */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
