import { MainLayout } from '@/components/layout/MainLayout';
import { AddTeamDialog } from '@/components/shared/AddTeamDialog';
import { TeamList } from '@/components/teams/TeamList';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Responsive header: stack on small screens, space-between on larger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tus Equipos</h1> {/* Translated */}
        <AddTeamDialog />
      </div>
      <Separator className="mb-8 bg-border/50" />
      <TeamList />
    </MainLayout>
  );
}
