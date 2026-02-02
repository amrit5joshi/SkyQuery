import { getAmadeusToken } from "./token-manager";

const BASE_URL = process.env.AMADEUS_ENV === "test"
    ? "https://test.api.amadeus.com/v2"
    : "https://api.amadeus.com/v2";

interface SearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: string;
    max?: string;
}

export async function searchFlightOffers(params: SearchParams) {
    const token = await getAmadeusToken();

    const searchParams = new URLSearchParams({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults,
        max: params.max || "10",
    });

    if (params.returnDate) {
        searchParams.append("returnDate", params.returnDate);
    }

    const response = await fetch(`${BASE_URL}/shopping/flight-offers?${searchParams}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Amadeus API Error: ${response.status} - ${errorBody}`);
    }

    return response.json();
}
