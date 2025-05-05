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
  flightTime: z.coerce.number().nonnegative({ message: "Flight Time must be non-negative." }),
  jumpHeight: z.coerce.number().nonnegative({ message: "Jump Height must be non-negative." }),
  repetitionIndex: z.coerce.number().nonnegative({ message: "Repetition Index must be non-negative." }),
  contactTime: z.coerce.number().nonnegative({ message: "Contact Time must be non-negative." }),
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
            title: "Success",
            description: `Jump data added for ${player.firstName} ${player.lastName}.`,
        });
        form.reset(); // Reset form fields
        setIsOpen(false); // Close dialog
    } catch (error) {
         console.error("Error adding jump data:", error);
         toast({
            title: "Error",
            description: "Failed to add jump data. Please try again.",
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
         <Button size="icon" variant="ghost" title="Add Jump Data">
            <TargetIcon className="h-4 w-4 text-accent" /> {/* Use custom target icon */}
         </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add Jump Test Data</DialogTitle>
          <DialogDescription>
            Enter the measurement values for {player.firstName} {player.lastName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
              control={form.control}
              name="flightTime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Flight Time</FormLabel>
                  <FormControl className="col-span-3">
                     <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="jumpHeight"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Jump Height</FormLabel>
                  <FormControl className="col-span-3">
                     <Input type="number" step="0.1" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="repetitionIndex"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Repetition Index</FormLabel>
                  <FormControl className="col-span-3">
                     <Input type="number" step="0.1" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactTime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Contact Time</FormLabel>
                  <FormControl className="col-span-3">
                     <Input type="number" step="0.01" {...field} />
                  </FormControl>
                   <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Data</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
