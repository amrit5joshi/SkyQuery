import { z } from "zod";

export const searchSchema = z.object({
    origin: z
        .string()
        .min(3, "Origin code must be 3 characters")
        .max(3, "Origin code must be 3 characters")
        .regex(/^[A-Z]{3}$/, "Must be an IATA code (e.g., LHR)"),
    destination: z
        .string()
        .min(3, "Destination code must be 3 characters")
        .max(3, "Destination code must be 3 characters")
        .regex(/^[A-Z]{3}$/, "Must be an IATA code (e.g., JFK)"),
    departureDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Departure date must be in the future",
    }),
    returnDate: z.string().optional(),
    adults: z.number().min(1).max(9).default(1),
    travelClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).default("ECONOMY"),
});

export type SearchParams = z.infer<typeof searchSchema>;
