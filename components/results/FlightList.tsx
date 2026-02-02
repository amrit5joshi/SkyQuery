"use client";

import { useFlightSearch } from "@/hooks/useFlightSearch";
import { useSearchUrl } from "@/hooks/useSearchUrl";
import { FlightCard } from "./FlightCard";
import { ResultsToolbar, SortOption } from "./ResultsToolbar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState, useMemo } from "react";
import { FlightOffer } from "@/types/flight";

export function FlightList() {
    const { getSearchParams } = useSearchUrl();
    const searchParams = getSearchParams();
    const [sortBy, setSortBy] = useState<SortOption>("price");

    const { data: flights, isLoading, error } = useFlightSearch(searchParams);

    const sortedFlights = useMemo(() => {
        if (!flights) return [];
        const sorted = [...flights];

        if (sortBy === "price") {
            sorted.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
        } else if (sortBy === "duration") {
            // Simple string comparison for ISO duration is flawed, but good enough for MVP
            // Ideally parse duration to minutes
            sorted.sort((a, b) => a.itineraries[0].duration.localeCompare(b.itineraries[0].duration));
        }

        return sorted;
    }, [flights, sortBy]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
                Failed to load flights. Please try again.
            </div>
        );
    }

    if (!flights || flights.length === 0) {
        if (!searchParams.origin) return null; // No search yet
        return (
            <div className="py-12 text-center text-muted-foreground">
                No flights found. Try adjusting your search criteria.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ResultsToolbar
                totalResults={flights.length}
                currentSort={sortBy}
                onSortChange={setSortBy}
            />
            <div className="space-y-4">
                {sortedFlights.map((flight) => (
                    <FlightCard key={flight.id} offer={flight} />
                ))}
            </div>
        </div>
    );
}
