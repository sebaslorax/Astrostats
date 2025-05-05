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

interface PlayerJumpChartProps {
  jumpData: JumpTestData[];
}

// Prepare data for the chart, maybe aggregate or format dates
const processChartData = (data: JumpTestData[]) => {
  return data
    .map(item => ({
      date: format(new Date(item.date), 'MMM dd'), // Format date for X-axis
      flightTime: item.flightTime,
      jumpHeight: item.jumpHeight,
      repetitionIndex: item.repetitionIndex,
      contactTime: item.contactTime,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure sorted by date asc
};


const chartConfig = {
  flightTime: { label: "Flight Time", color: "hsl(var(--chart-1))" },
  jumpHeight: { label: "Jump Height", color: "hsl(var(--chart-2))" },
  repetitionIndex: { label: "Repetition Index", color: "hsl(var(--chart-3))" },
  contactTime: { label: "Contact Time", color: "hsl(var(--chart-4))" }, // Added color for contact time
} satisfies React.ComponentProps<typeof ChartContainer>["config"];


export function PlayerJumpChart({ jumpData }: PlayerJumpChartProps) {
  const chartData = processChartData(jumpData);

   if (!chartData || chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Jump Data History</CardTitle>
          <CardDescription>No jump test data available for this player yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Add jump data to see the chart.</p>
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
        <CardTitle>Jump Data History</CardTitle>
        <CardDescription>Showing recent jump test results.</CardDescription>
      </CardHeader>
      <CardContent>
         <ChartContainer config={chartConfig} className="aspect-video h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                 <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value} // Already formatted
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                 />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <ChartTooltipPrimitive
                    cursor={false} // Disable default cursor
                    content={<ChartTooltipContent indicator="dot" hideLabel />} // Use shadcn tooltip
                 />
                 <Legend content={<ChartLegendContent />} />
                 {activeDataKeys.includes("flightTime") && <Bar dataKey="flightTime" fill="var(--color-flightTime)" radius={4} />}
                 {activeDataKeys.includes("jumpHeight") && <Bar dataKey="jumpHeight" fill="var(--color-jumpHeight)" radius={4} />}
                 {activeDataKeys.includes("repetitionIndex") && <Bar dataKey="repetitionIndex" fill="var(--color-repetitionIndex)" radius={4} />}
                 {activeDataKeys.includes("contactTime") && <Bar dataKey="contactTime" fill="var(--color-contactTime)" radius={4} />}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2 text-sm">
         <div className="flex gap-2 font-medium leading-none text-muted-foreground">
            {/* Optionally show trend indicators or summary stats */}
            {/* <TrendingUp className="h-4 w-4" /> Overall trend calculation could go here */}
            Data shown chronologically. Hover over bars for details.
         </div>
      </CardFooter>
    </Card>
  );
}
