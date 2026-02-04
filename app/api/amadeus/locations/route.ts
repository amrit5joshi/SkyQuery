import { NextRequest, NextResponse } from "next/server";
import { getAmadeusToken } from "@/lib/amadeus/token-manager";
import { getGlobalAirports } from "@/lib/external-airports";

const BASE_URL = process.env.AMADEUS_ENV === "test"
    ? "https://test.api.amadeus.com/v1"
    : "https://api.amadeus.com/v1";

interface Location {
    iataCode: string;
    name: string;
    address: {
        cityName?: string;
        countryName?: string;
    };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword")?.toUpperCase();

    if (!keyword || keyword.length < 2) {
        return NextResponse.json([]);
    }

    const globalAirports = await getGlobalAirports();

    const localMatches = globalAirports.filter(airport =>
        airport.iataCode.includes(keyword) ||
        airport.address.cityName?.toUpperCase().includes(keyword) ||
        airport.name.toUpperCase().includes(keyword) ||
        airport.address.countryName?.toUpperCase().includes(keyword)
    );

    try {
        const token = await getAmadeusToken();
        const response = await fetch(
            `${BASE_URL}/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}&page[limit]=20`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        let apiResults: Location[] = [];
        if (response.ok) {
            const data = await response.json();
            apiResults = data.data || [];
        }

        const combined = [...apiResults, ...localMatches];
        const unique = combined.filter((loc, index, self) =>
            index === self.findIndex((t) => t.iataCode === loc.iataCode)
        );

        return NextResponse.json(unique);
    } catch (error) {
        console.error("Location search error:", error);
        return NextResponse.json(localMatches);
    }
}
