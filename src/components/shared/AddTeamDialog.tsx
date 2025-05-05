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
        title: "Error",
        description: "Team name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    addTeam(teamName);
    toast({
      title: "Success",
      description: `Team "${teamName}" created successfully.`,
    });
    setTeamName(''); // Clear input
    setIsOpen(false); // Close dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Enter the name for the new soccer team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-name" className="text-right">
              Team Name
            </Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Galactic Strikers"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddTeam}>Create Team</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
