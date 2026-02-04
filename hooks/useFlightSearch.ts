import { useQuery } from "@tanstack/react-query";
import { type FlightOffer } from "@/types/flight";
import { type SearchParams } from "@/lib/validations/search";

async function fetchFlights(params: Partial<SearchParams>): Promise<FlightOffer[]> {
    const searchParams = new URLSearchParams();

    if (params.origin) searchParams.set("origin", params.origin);
    if (params.destination) searchParams.set("destination", params.destination);
    if (params.departureDate) searchParams.set("departureDate", params.departureDate);
    if (params.returnDate) searchParams.set("returnDate", params.returnDate);
    if (params.adults) searchParams.set("adults", params.adults.toString());
    if (params.travelClass) searchParams.set("travelClass", params.travelClass);

    const response = await fetch(`/api/amadeus/flight-offers?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to fetch flights");
    }

    return response.json();
}

export function useFlightSearch(searchParams: Partial<SearchParams>) {
    const isEnabled = !!(
        searchParams.origin &&
        searchParams.destination &&
        searchParams.departureDate
    );

    return useQuery({
        queryKey: ["flights", searchParams],
        queryFn: () => fetchFlights(searchParams),
        enabled: isEnabled,
        staleTime: 1000 * 60 * 5,
    });
}
