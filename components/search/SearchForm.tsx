"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSearchUrl } from "@/hooks/useSearchUrl";
import { searchSchema, type SearchParams } from "@/lib/validations/search";
import { cn } from "@/lib/utils";

export function SearchForm({ className }: { className?: string }) {
    const { setSearchParams, getSearchParams } = useSearchUrl();
    const defaultValues = getSearchParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SearchParams>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            origin: defaultValues.origin || "",
            destination: defaultValues.destination || "",
            departureDate: defaultValues.departureDate || "",
            returnDate: defaultValues.returnDate,
        },
    });

    // Sync form with URL if it changes externally (e.g. back button)
    useEffect(() => {
        reset(getSearchParams());
    }, [reset]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = (data: SearchParams) => {
        setSearchParams(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
                "grid w-full grid-cols-1 gap-4 md:grid-cols-4 md:gap-2",
                "rounded-lg border bg-card p-4 text-card-foreground shadow-sm",
                className
            )}
        >
            <div className="space-y-2">
                <Input
                    placeholder="Origin (e.g. LHR)"
                    {...register("origin")}
                    className={cn(errors.origin && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.origin && (
                    <p className="text-xs text-destructive">{errors.origin.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Input
                    placeholder="Destination (e.g. JFK)"
                    {...register("destination")}
                    className={cn(errors.destination && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.destination && (
                    <p className="text-xs text-destructive">{errors.destination.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Input
                    type="date"
                    {...register("departureDate")}
                    className={cn(errors.departureDate && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.departureDate && (
                    <p className="text-xs text-destructive">{errors.departureDate.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search Flights
            </Button>
        </form>
    );
}
