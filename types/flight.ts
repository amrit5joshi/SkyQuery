export interface FlightSegment {
    departure: {
        iataCode: string;
        at: string; // ISO DateTime
        city?: string;
    };
    arrival: {
        iataCode: string;
        at: string; // ISO DateTime
        city?: string;
    };
    carrierCode: string;
    number: string;
    duration: string;
}

export interface FlightItinerary {
    duration: string;
    segments: FlightSegment[];
}

export interface FlightOffer {
    id: string;
    price: {
        currency: string;
        total: string;
        base: string;
    };
    itineraries: FlightItinerary[];
    validatingAirlineCodes: string[];
    numberOfBookableSeats: number;
}
