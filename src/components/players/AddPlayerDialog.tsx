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
import { cn } from "@/lib/utils";
import { useAstroActions } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddPlayerDialogProps {
  teamId: string;
}

const playerFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  sex: z.enum(['Male', 'Female', 'Other'], { required_error: "Sex is required."}),
  height: z.coerce.number().positive({ message: "Height must be a positive number." }).optional().or(z.literal('')), // Allow empty string initially
  weight: z.coerce.number().positive({ message: "Weight must be a positive number." }).optional().or(z.literal('')), // Allow empty string initially
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
            title: "Success",
            description: `Player ${data.firstName} ${data.lastName} added successfully.`,
        });
        form.reset(); // Reset form fields
        setIsOpen(false); // Close dialog
    } catch (error) {
         console.error("Error adding player:", error);
         toast({
            title: "Error",
            description: "Failed to add player. Please try again.",
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>
            Enter the details for the new player.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">First Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="e.g., Lionel" {...field} />
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
                  <FormLabel className="text-right">Last Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="e.g., Messi" {...field} />
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
                    <FormLabel className="text-right">Date of Birth</FormLabel>
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
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
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
                        <FormLabel className="text-right">Sex</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl className="col-span-3">
                                <SelectTrigger>
                                <SelectValue placeholder="Select sex" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
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
                  <FormLabel className="text-right">Height (cm)</FormLabel>
                  <FormControl className="col-span-3">
                     <Input type="number" placeholder="e.g., 170" {...field} />
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
                  <FormLabel className="text-right">Weight (kg)</FormLabel>
                  <FormControl className="col-span-3">
                     <Input type="number" placeholder="e.g., 68" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Player</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
