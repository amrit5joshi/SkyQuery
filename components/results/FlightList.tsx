"use client";

import { useFlightSearch } from "@/hooks/useFlightSearch";
import { useSearchUrl } from "@/hooks/useSearchUrl";
import { FlightCard } from "./FlightCard";
import { ResultsToolbar, SortOption } from "./ResultsToolbar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState, useMemo, useEffect } from "react";
import { FlightOffer } from "@/types/flight";
import { useFilterStore } from "@/store/filterStore";
import { filterFlights, getMaxPrice, getUniqueAirlines } from "@/lib/filtering";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { PriceGraph } from "@/components/analytics/PriceGraph";
import { MobileFilterDrawer } from "@/components/filters/MobileFilterDrawer";
import { AnimatePresence, motion } from "framer-motion";

export function FlightList() {
    const { getSearchParams } = useSearchUrl();
    const searchParams = getSearchParams();
    const [sortBy, setSortBy] = useState<SortOption>("price");

    const { data: flights, isLoading, error } = useFlightSearch(searchParams);
    const filterState = useFilterStore();

    useEffect(() => {
        filterState.reset();
    }, [searchParams.origin, searchParams.destination, searchParams.departureDate]);

    const { filteredFlights, availableAirlines, maxPrice, cheapestId, fastestId } = useMemo(() => {
        if (!flights) return { filteredFlights: [], availableAirlines: [], maxPrice: 1000, cheapestId: "", fastestId: "" };

        const availableAirlines = getUniqueAirlines(flights);
        const maxPrice = getMaxPrice(flights);

        // Apply filters
        const filtered = filterFlights(flights, {
            maxPrice: filterState.maxPrice,
            stops: filterState.stops,
            airlines: filterState.airlines
        });

        // Find badges
        let cheapestId = "";
        let fastestId = "";
        let minPrice = Infinity;
        let minDurationStr = "";

        // Calculate badges only if we have results
        if (filtered.length > 0) {
            filtered.forEach(f => {
                const price = parseFloat(f.price.total);
                if (price < minPrice) {
                    minPrice = price;
                    cheapestId = f.id;
                }
                const duration = f.itineraries[0].duration; // ISO string comparison
                if (!minDurationStr || duration.localeCompare(minDurationStr) < 0) { // simplified duration check
                    minDurationStr = duration;
                    fastestId = f.id;
                }
            });
        }

        // Apply sorting
        if (sortBy === "price") {
            filtered.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
        } else if (sortBy === "duration") {
            filtered.sort((a, b) => a.itineraries[0].duration.localeCompare(b.itineraries[0].duration));
        }

        return { filteredFlights: filtered, availableAirlines, maxPrice, cheapestId, fastestId };
    }, [flights, filterState.maxPrice, filterState.stops, filterState.airlines, sortBy]);

    if (isLoading) {
        return (
            <div className="grid gap-8 lg:grid-cols-4">
                <div className="hidden lg:block space-y-6">
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-3 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                    ))}
                </div>
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
        if (!searchParams.origin) return null;
        return (
            <div className="py-12 text-center text-muted-foreground">
                No flights found. Try adjusting your search criteria.
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar - Hidden on mobile */}
            <aside className="hidden lg:block">
                <div className="sticky top-24">
                    <FilterSidebar maxPrice={maxPrice} airlines={availableAirlines} />
                </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3 space-y-4">

                {/* Mobile Filters Trigger */}
                <div className="lg:hidden">
                    <MobileFilterDrawer maxPrice={maxPrice} airlines={availableAirlines} />
                </div>

                {/* Price Trend Chart */}
                {filteredFlights.length > 0 && (
                    <PriceGraph flights={filteredFlights} />
                )}

                <ResultsToolbar
                    totalResults={filteredFlights.length}
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                />

                {filteredFlights.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
                        No flights match your filters.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredFlights.map((flight) => (
                                <motion.div
                                    key={flight.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FlightCard
                                        offer={flight}
                                        isCheapest={flight.id === cheapestId}
                                        isFastest={flight.id === fastestId}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
