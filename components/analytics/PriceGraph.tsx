"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { FlightOffer } from "@/types/flight";
import { generatePriceHistogram } from "@/lib/analytics";

interface PriceGraphProps {
    flights: FlightOffer[];
}

export function PriceGraph({ flights }: PriceGraphProps) {
    const data = useMemo(() => generatePriceHistogram(flights), [flights]);

    if (flights.length < 2) return null;

    return (
        <div className="h-[200px] w-full rounded-lg border bg-card p-4 transition-all hover:shadow-md">
            <div className="mb-4 text-sm font-semibold text-muted-foreground">Price Distribution</div>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="label"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px',
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
