"use client";

import * as React from "react";
import { Check, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

interface Location {
    iataCode: string;
    name: string;
    address: {
        cityName?: string;
        countryName?: string;
    };
}

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function LocationAutocomplete({ value, onChange, placeholder, className }: LocationAutocompleteProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [locations, setLocations] = React.useState<Location[]>([]);
    const [loading, setLoading] = React.useState(false);

    const debouncedSearch = useDebounceValue(inputValue, 500);

    React.useEffect(() => {
        if (debouncedSearch.length < 2) {
            setLocations([]);
            return;
        }

        const fetchLocations = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/amadeus/locations?keyword=${debouncedSearch}`);
                const data = await res.json();

                // Deduplicate by IATA code
                const uniqueLocations = data.filter((loc: Location, index: number, self: Location[]) =>
                    index === self.findIndex((t) => t.iataCode === loc.iataCode)
                );

                setLocations(uniqueLocations);
            } catch (error) {
                console.error(error);
                setLocations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [debouncedSearch]);

    return (
        <div className={cn("relative", className)}>
            <div className="relative">
                <input
                    type="text"
                    value={inputValue || value}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (!open) setOpen(true);
                        if (e.target.value === "") onChange("");
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className={cn(
                        "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                />
                {loading && (
                    <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
            </div>

            {open && (inputValue.length > 0 || locations.length > 0) && (
                <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                    <div className="group overflow-hidden rounded-md">
                        {locations.length === 0 && !loading && inputValue.length > 1 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">No locations found.</div>
                        ) : (
                            <ul className="max-h-[300px] overflow-y-auto p-1">
                                {locations.map((loc, index) => (
                                    <li
                                        key={`${loc.iataCode}-${index}`}
                                        onClick={() => {
                                            onChange(loc.iataCode);
                                            setInputValue(`${loc.address.cityName} (${loc.iataCode})`);
                                            setOpen(false);
                                        }}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    >
                                        <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{loc.address.cityName} ({loc.iataCode})</span>
                                            <span className="text-xs text-muted-foreground">{loc.name}</span>
                                        </div>
                                        {value === loc.iataCode && (
                                            <Check className="ml-auto h-4 w-4" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
                </div>
            )}
        </div>
    );
}
