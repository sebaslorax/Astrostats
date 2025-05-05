"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip as ChartTooltipPrimitive, // Rename primitive to avoid conflict
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"; // Use shadcn/ui chart components
import type { JumpTestData } from "@/lib/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale

interface PlayerJumpChartProps {
  jumpData: JumpTestData[];
}

// Prepare data for the chart, maybe aggregate or format dates
const processChartData = (data: JumpTestData[]) => {
  return data
    .map(item => ({
      // Use shorter date format for mobile
      date: format(new Date(item.date), 'dd MMM yy', { locale: es }), // Format date for X-axis in Spanish
      flightTime: item.flightTime,
      jumpHeight: item.jumpHeight,
      repetitionIndex: item.repetitionIndex,
      contactTime: item.contactTime,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure sorted by date asc
};


const chartConfig = {
  flightTime: { label: "Tiempo Vuelo", color: "hsl(var(--chart-1))" }, // Translated
  jumpHeight: { label: "Altura Salto", color: "hsl(var(--chart-2))" }, // Translated
  repetitionIndex: { label: "Índice Rep.", color: "hsl(var(--chart-3))" }, // Translated (Abbreviated)
  contactTime: { label: "Tiempo Contacto", color: "hsl(var(--chart-4))" }, // Translated
} satisfies React.ComponentProps<typeof ChartContainer>["config"];


export function PlayerJumpChart({ jumpData }: PlayerJumpChartProps) {
  const chartData = processChartData(jumpData);

   if (!chartData || chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Historial de Datos de Salto</CardTitle> {/* Translated */}
          <CardDescription>Aún no hay datos de pruebas de salto disponibles para este jugador.</CardDescription> {/* Translated */}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 sm:h-64"> {/* Adjusted height */}
            <p className="text-muted-foreground text-center px-4">Añade datos de salto para ver el gráfico.</p> {/* Translated */}
        </CardContent>
      </Card>
    );
  }

  // Determine which data keys to show based on available data
  // For simplicity, showing all 4 if data exists. Customize if needed.
  const activeDataKeys = Object.keys(chartConfig) as (keyof typeof chartConfig)[];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Historial de Datos de Salto</CardTitle> {/* Translated */}
        <CardDescription className="text-sm">Mostrando los resultados recientes de las pruebas de salto.</CardDescription> {/* Translated, smaller text */}
      </CardHeader>
      <CardContent>
         {/* Adjusted height and aspect ratio for responsiveness */}
         <ChartContainer config={chartConfig} className="aspect-video h-[250px] sm:h-[300px] lg:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}> {/* Reduced margins */}
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                 <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value} // Already formatted
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10} // Smaller font for axis
                    // interval={Math.ceil(chartData.length / 5)} // Adjust interval for mobile if needed
                 />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10} // Smaller font for axis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5} // Adjust margin
                  />
                 <ChartTooltipPrimitive
                    cursor={false} // Disable default cursor
                    content={<ChartTooltipContent indicator="dot" hideLabel />} // Use shadcn tooltip
                 />
                 <Legend content={<ChartLegendContent nameKey="label" />} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} /> {/* Smaller legend */}
                 {activeDataKeys.includes("flightTime") && <Bar dataKey="flightTime" fill="var(--color-flightTime)" radius={2} barSize={15} />} {/* Smaller radius and bar size */}
                 {activeDataKeys.includes("jumpHeight") && <Bar dataKey="jumpHeight" fill="var(--color-jumpHeight)" radius={2} barSize={15}/>}
                 {activeDataKeys.includes("repetitionIndex") && <Bar dataKey="repetitionIndex" fill="var(--color-repetitionIndex)" radius={2} barSize={15}/>}
                 {activeDataKeys.includes("contactTime") && <Bar dataKey="contactTime" fill="var(--color-contactTime)" radius={2} barSize={15}/>}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm p-4 sm:p-6"> {/* Smaller padding and text on mobile */}
         <div className="flex gap-2 font-medium leading-none text-muted-foreground">
            {/* Optionally show trend indicators or summary stats */}
            {/* <TrendingUp className="h-4 w-4" /> Overall trend calculation could go here */}
            Datos mostrados cronológicamente. Pasa el cursor sobre las barras para ver detalles. {/* Translated */}
         </div>
      </CardFooter>
    </Card>
  );
}
