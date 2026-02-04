import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { type SearchParams } from "@/lib/validations/search";

export function useSearchUrl() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (params: SearchParams) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    newSearchParams.set(key, String(value));
                } else {
                    newSearchParams.delete(key);
                }
            });

            return newSearchParams.toString();
        },
        [searchParams]
    );

    const setSearchParams = (params: SearchParams) => {
        router.push(`/?${createQueryString(params)}`);
    };

    const getSearchParams = (): Partial<SearchParams> => {
        return {
            origin: searchParams.get("origin") || "",
            destination: searchParams.get("destination") || "",
            departureDate: searchParams.get("departureDate") || "",
            returnDate: searchParams.get("returnDate") || undefined,
            adults: Number(searchParams.get("adults")) || 1,
            travelClass: (searchParams.get("travelClass") as any) || "ECONOMY",
        };
    };

    return { setSearchParams, getSearchParams };
}
