import { MainLayout } from '@/components/layout/MainLayout';
import { AddTeamDialog } from '@/components/shared/AddTeamDialog';
import { TeamList } from '@/components/teams/TeamList';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Teams</h1>
        <AddTeamDialog />
      </div>
      <Separator className="mb-8 bg-border/50" />
      <TeamList />
    </MainLayout>
  );
}
