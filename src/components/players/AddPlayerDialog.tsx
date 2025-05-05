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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from "date-fns";
import { es } from 'date-fns/locale'; // Import Spanish locale for date-fns
import { cn } from "@/lib/utils";
import { useAstroActions } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddPlayerDialogProps {
  teamId: string;
}

const playerFormSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es obligatorio." }), // Translated
  lastName: z.string().min(1, { message: "El apellido es obligatorio." }), // Translated
  dob: z.date({ required_error: "La fecha de nacimiento es obligatoria." }), // Translated
  sex: z.enum(['Masculino', 'Femenino', 'Otro'], { required_error: "El sexo es obligatorio."}), // Translated options and error
  height: z.coerce.number().positive({ message: "La altura debe ser un número positivo." }).optional().or(z.literal('')), // Translated message
  weight: z.coerce.number().positive({ message: "El peso debe ser un número positivo." }).optional().or(z.literal('')), // Translated message
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

export function AddPlayerDialog({ teamId }: AddPlayerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addPlayer } = useAstroActions();
  const { toast } = useToast();

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      sex: undefined, // Ensure it's undefined initially for placeholder
      height: '', // Start as empty string
      weight: '', // Start as empty string
    },
  });

   const onSubmit = (data: PlayerFormValues) => {
    try {
        // Prepare data for the store action
        const playerData = {
            ...data,
            dob: data.dob.toISOString(), // Convert date to ISO string
            teamId: teamId,
            // Ensure height/weight are numbers or handle empty strings as needed by your logic (e.g., store null or 0)
            // For simplicity, we'll pass them as they are coerced by Zod. If empty, they become NaN, handle this if needed.
        };
        addPlayer(playerData);
        toast({
            title: "Éxito", // Translated
            description: `Jugador ${data.firstName} ${data.lastName} añadido con éxito.`, // Translated
        });
        form.reset(); // Reset form fields
        setIsOpen(false); // Close dialog
    } catch (error) {
         console.error("Error adding player:", error);
         toast({
            title: "Error", // Translated
            description: "Error al añadir el jugador. Por favor, inténtalo de nuevo.", // Translated
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Nuevo Jugador {/* Translated */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Jugador</DialogTitle> {/* Translated */}
          <DialogDescription>
            Introduce los detalles del nuevo jugador. {/* Translated */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Nombre</FormLabel> {/* Translated */}
                  <FormControl className="col-span-3">
                    <Input placeholder="ej., Lionel" {...field} /> {/* Translated */}
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Apellido</FormLabel> {/* Translated */}
                  <FormControl className="col-span-3">
                    <Input placeholder="ej., Messi" {...field} /> {/* Translated */}
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Fecha de Nacimiento</FormLabel> {/* Translated */}
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl className="col-span-3">
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elige una fecha</span>} {/* Translated, used Spanish locale */}
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            locale={es} // Set Spanish locale for calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Sexo</FormLabel> {/* Translated */}
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl className="col-span-3">
                                <SelectTrigger>
                                <SelectValue placeholder="Selecciona sexo" /> {/* Translated */}
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Masculino">Masculino</SelectItem> {/* Translated */}
                                <SelectItem value="Femenino">Femenino</SelectItem> {/* Translated */}
                                <SelectItem value="Otro">Otro</SelectItem> {/* Translated */}
                            </SelectContent>
                        </Select>
                        <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                )}
             />
              <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Altura (cm)</FormLabel> {/* Translated */}
                  <FormControl className="col-span-3">
                     <Input type="number" placeholder="ej., 170" {...field} /> {/* Translated */}
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Peso (kg)</FormLabel> {/* Translated */}
                  <FormControl className="col-span-3">
                     <Input type="number" placeholder="ej., 68" {...field} /> {/* Translated */}
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button> {/* Translated */}
                </DialogClose>
                <Button type="submit">Añadir Jugador</Button> {/* Translated */}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
