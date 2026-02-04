import { NextRequest, NextResponse } from "next/server";
import { getAmadeusToken } from "@/lib/amadeus/token-manager";

const BASE_URL = process.env.AMADEUS_ENV === "test"
    ? "https://test.api.amadeus.com/v1"
    : "https://api.amadeus.com/v1";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.length < 2) {
        return NextResponse.json([]);
    }

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

        if (!response.ok) {
            throw new Error("Failed to fetch locations");
        }

        const data = await response.json();
        return NextResponse.json(data.data || []);
    } catch (error) {
        console.error("Location search error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
