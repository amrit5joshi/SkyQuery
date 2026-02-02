import { NextRequest, NextResponse } from "next/server";
import { searchFlightOffers } from "@/lib/amadeus/client";
import { z } from "zod";
import { normalizeFlightOffers } from "@/lib/normalization/flight-adapter";

const querySchema = z.object({
    origin: z.string().length(3),
    destination: z.string().length(3),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const rawParams = {
        origin: searchParams.get("origin") || "",
        destination: searchParams.get("destination") || "",
        departureDate: searchParams.get("departureDate") || "",
        returnDate: searchParams.get("returnDate") || undefined,
    };

    try {
        const validParams = querySchema.parse(rawParams);

        const amadeusData = await searchFlightOffers({
            originLocationCode: validParams.origin,
            destinationLocationCode: validParams.destination,
            departureDate: validParams.departureDate,
            returnDate: validParams.returnDate,
            adults: "1", // Hardcoded to 1 adult for this demo
            max: "20",
        });

        const normalizedData = normalizeFlightOffers(amadeusData);

        return NextResponse.json(normalizedData);
    } catch (error) {
        console.error("Flight Search Error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid parameters", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
