import { FlightOffer } from "@/types/flight";

export interface FilterState {
    maxPrice: number | null;
    stops: number[];
    airlines: string[];
}

export function filterFlights(flights: FlightOffer[], filters: FilterState): FlightOffer[] {
    return flights.filter((flight) => {
        if (filters.maxPrice !== null) {
            if (parseFloat(flight.price.total) > filters.maxPrice) {
                return false;
            }
        }

        if (filters.stops.length > 0) {
            const flightStops = flight.itineraries[0].segments.length - 1;
            if (!filters.stops.includes(flightStops)) {
                return false;
            }
        }

        if (filters.airlines.length > 0) {
            const carrier = flight.validatingAirlineCodes[0];
            if (!filters.airlines.includes(carrier)) {
                return false;
            }
        }

        return true;
    });
}

export function getUniqueAirlines(flights: FlightOffer[]): string[] {
    const airlines = new Set<string>();
    flights.forEach((f) => {
        f.validatingAirlineCodes.forEach((code) => airlines.add(code));
    });
    return Array.from(airlines).sort();
}

export function getMaxPrice(flights: FlightOffer[]): number {
    if (flights.length === 0) return 1000;

    return Math.ceil(
        Math.max(...flights.map((f) => parseFloat(f.price.total)))
    );
}
