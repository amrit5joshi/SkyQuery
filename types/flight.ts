export interface FlightSegment {
    departure: {
        iataCode: string;
        at: string; // ISO DateTime
    };
    arrival: {
        iataCode: string;
        at: string; // ISO DateTime
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
