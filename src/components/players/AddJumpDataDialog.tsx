"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAstroActions } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Player } from '@/lib/types';
import { TargetIcon } from '@/components/icons/TargetIcon'; // Custom Icon

interface AddJumpDataDialogProps {
  player: Player;
}

const jumpDataFormSchema = z.object({
  flightTime: z.coerce.number().nonnegative({ message: "El Tiempo de Vuelo debe ser no negativo." }), // Translated
  jumpHeight: z.coerce.number().nonnegative({ message: "La Altura de Salto debe ser no negativa." }), // Translated
  repetitionIndex: z.coerce.number().nonnegative({ message: "El Índice de Repetición debe ser no negativo." }), // Translated
  contactTime: z.coerce.number().nonnegative({ message: "El Tiempo de Contacto debe ser no negativo." }), // Translated
});

type JumpDataFormValues = z.infer<typeof jumpDataFormSchema>;

export function AddJumpDataDialog({ player }: AddJumpDataDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addJumpData } = useAstroActions();
  const { toast } = useToast();

  const form = useForm<JumpDataFormValues>({
    resolver: zodResolver(jumpDataFormSchema),
    defaultValues: {
      flightTime: 0,
      jumpHeight: 0,
      repetitionIndex: 0,
      contactTime: 0,
    },
  });

   const onSubmit = (data: JumpDataFormValues) => {
    try {
        const jumpDataPayload = {
            ...data,
            date: new Date().toISOString(), // Record the current date/time
        };
        addJumpData(player.id, jumpDataPayload);
        toast({
            title: "Éxito", // Translated
            description: `Datos de salto añadidos para ${player.firstName} ${player.lastName}.`, // Translated
        });
        form.reset(); // Reset form fields
        setIsOpen(false); // Close dialog
    } catch (error) {
         console.error("Error adding jump data:", error);
         toast({
            title: "Error", // Translated
            description: "Error al añadir los datos de salto. Por favor, inténtalo de nuevo.", // Translated
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
         {/* Increased button size slightly for better touch target */}
         <Button size="icon" variant="ghost" title="Añadir Datos de Salto" className="h-9 w-9"> {/* Translated */}
            <TargetIcon className="h-5 w-5 text-accent" /> {/* Use custom target icon */}
         </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Añadir Datos de Prueba de Salto</DialogTitle> {/* Translated */}
          <DialogDescription className="text-sm"> {/* Smaller description text */}
            Introduce los valores de medición para {player.firstName} {player.lastName}. {/* Translated */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
              control={form.control}
              name="flightTime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
                  <FormLabel className="sm:text-right">Tiempo de Vuelo</FormLabel> {/* Translated */}
                  <FormControl className="col-span-1 sm:col-span-3">
                     <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-1 sm:col-span-4 sm:text-right" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="jumpHeight"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
                  <FormLabel className="sm:text-right">Altura de Salto</FormLabel> {/* Translated */}
                  <FormControl className="col-span-1 sm:col-span-3">
                     <Input type="number" step="0.1" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-1 sm:col-span-4 sm:text-right" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="repetitionIndex"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
                  <FormLabel className="sm:text-right">Índice Repetición</FormLabel> {/* Translated */}
                  <FormControl className="col-span-1 sm:col-span-3">
                     <Input type="number" step="0.1" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-1 sm:col-span-4 sm:text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactTime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
                  <FormLabel className="sm:text-right">Tiempo Contacto</FormLabel> {/* Translated */}
                  <FormControl className="col-span-1 sm:col-span-3">
                     <Input type="number" step="0.01" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-1 sm:col-span-4 sm:text-right" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0"> {/* Responsive footer */}
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">Cancelar</Button> {/* Translated */}
                </DialogClose>
                <Button type="submit" className="w-full sm:w-auto">Guardar Datos</Button> {/* Translated */}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
