import { FlightOffer, FlightItinerary, FlightSegment } from "@/types/flight";

// These types mirror the Amadeus API response structure partially
interface AmadeusSegment {
    departure: { iataCode: string; at: string };
    arrival: { iataCode: string; at: string };
    carrierCode: string;
    number: string;
    duration: string;
    id: string;
    numberOfStops: number;
    blacklistedInEU: boolean;
}

interface AmadeusItinerary {
    duration: string;
    segments: AmadeusSegment[];
}

interface AmadeusPrice {
    currency: string;
    total: string;
    base: string;
    fees?: { amount: string; type: string }[];
    grandTotal?: string;
}

interface AmadeusOffer {
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: AmadeusItinerary[];
    price: AmadeusPrice;
    pricingOptions: { fareType: string[]; includedCheckedBagsOnly: boolean };
    validatingAirlineCodes: string[];
    travelerPricings: any[];
}

export function normalizeFlightOffer(rawOffer: AmadeusOffer): FlightOffer {
    return {
        id: rawOffer.id,
        price: {
            currency: rawOffer.price.currency,
            total: rawOffer.price.grandTotal || rawOffer.price.total,
            base: rawOffer.price.base,
        },
        itineraries: rawOffer.itineraries.map(normalizeItinerary),
        validatingAirlineCodes: rawOffer.validatingAirlineCodes,
        numberOfBookableSeats: rawOffer.numberOfBookableSeats,
    };
}

function normalizeItinerary(rawItinerary: AmadeusItinerary): FlightItinerary {
    return {
        duration: rawItinerary.duration, // e.g. "PT2H30M"
        segments: rawItinerary.segments.map(normalizeSegment),
    };
}

function normalizeSegment(rawSegment: AmadeusSegment): FlightSegment {
    return {
        departure: {
            iataCode: rawSegment.departure.iataCode,
            at: rawSegment.departure.at,
        },
        arrival: {
            iataCode: rawSegment.arrival.iataCode,
            at: rawSegment.arrival.at,
        },
        carrierCode: rawSegment.carrierCode,
        number: rawSegment.number,
        duration: rawSegment.duration,
    };
}

export function normalizeFlightOffers(rawResponse: { data: AmadeusOffer[] }): FlightOffer[] {
    if (!rawResponse || !Array.isArray(rawResponse.data)) {
        return [];
    }
    return rawResponse.data.map(normalizeFlightOffer);
}
