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

export function normalizeFlightOffer(rawOffer: AmadeusOffer, locations?: Record<string, any>): FlightOffer {
    return {
        id: rawOffer.id,
        price: {
            currency: rawOffer.price.currency,
            total: rawOffer.price.grandTotal || rawOffer.price.total,
            base: rawOffer.price.base,
        },
        itineraries: rawOffer.itineraries.map((it) => normalizeItinerary(it, locations)),
        validatingAirlineCodes: rawOffer.validatingAirlineCodes,
        numberOfBookableSeats: rawOffer.numberOfBookableSeats,
    };
}

function normalizeItinerary(rawItinerary: AmadeusItinerary, locations?: Record<string, any>): FlightItinerary {
    return {
        duration: rawItinerary.duration,
        segments: rawItinerary.segments.map((seg) => normalizeSegment(seg, locations)),
    };
}

function normalizeSegment(rawSegment: AmadeusSegment, locations?: Record<string, any>): FlightSegment {
    return {
        departure: {
            iataCode: rawSegment.departure.iataCode,
            at: rawSegment.departure.at,
            city: locations?.[rawSegment.departure.iataCode]?.cityCode || locations?.[rawSegment.departure.iataCode]?.cityName,
        },
        arrival: {
            iataCode: rawSegment.arrival.iataCode,
            at: rawSegment.arrival.at,
            city: locations?.[rawSegment.arrival.iataCode]?.cityCode || locations?.[rawSegment.arrival.iataCode]?.cityName,
        },
        carrierCode: rawSegment.carrierCode,
        number: rawSegment.number,
        duration: rawSegment.duration,
    };
}

interface AmadeusResponse {
    data: AmadeusOffer[];
    dictionaries?: {
        locations?: Record<string, any>;
    };
}

export function normalizeFlightOffers(rawResponse: AmadeusResponse): FlightOffer[] {
    if (!rawResponse || !Array.isArray(rawResponse.data)) {
        return [];
    }
    const locations = rawResponse.dictionaries?.locations;
    return rawResponse.data.map((offer) => normalizeFlightOffer(offer, locations));
}
