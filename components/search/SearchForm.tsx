"use client";

import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plane, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useSearchUrl } from "@/hooks/useSearchUrl";
import { searchSchema, type SearchParams } from "@/lib/validations/search";
import { cn } from "@/lib/utils";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { DatePicker } from "./DatePicker";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";

export function SearchForm({ className }: { className?: string }) {
    const { setSearchParams, getSearchParams } = useSearchUrl();
    const searchParams = useSearchParams();
    const defaultValues = getSearchParams();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SearchParams>({
        resolver: zodResolver(searchSchema) as any,
        defaultValues: {
            origin: defaultValues.origin || "",
            destination: defaultValues.destination || "",
            departureDate: defaultValues.departureDate || "",
            returnDate: defaultValues.returnDate,
            adults: defaultValues.adults || 1,
            travelClass: defaultValues.travelClass || "ECONOMY",
        },
    });

    useEffect(() => {
        const params = getSearchParams();
        reset(params);
    }, [searchParams, reset]);

    const onSubmit = (data: SearchParams) => {
        setSearchParams(data);
    };

    const tripType = watch("returnDate") ? "round-trip" : "one-way";

    return (
        <div className={cn("w-full", className)}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn(
                    "grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-2",
                    "rounded-xl border bg-card p-4 sm:p-6 text-card-foreground shadow-lg"
                )}
            >
                <div className="lg:col-span-4">
                    <Controller
                        name="origin"
                        control={control}
                        render={({ field }) => (
                            <LocationAutocomplete
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="From"
                                className={cn(errors.origin && "border-destructive")}
                            />
                        )}
                    />
                </div>

                <div className="lg:col-span-4">
                    <Controller
                        name="destination"
                        control={control}
                        render={({ field }) => (
                            <LocationAutocomplete
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="To"
                                className={cn(errors.destination && "border-destructive")}
                            />
                        )}
                    />
                </div>

                <div className="lg:col-span-2">
                    <Controller
                        name="departureDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                date={field.value ? new Date(field.value) : undefined}
                                setDate={(date) => {
                                    const newDep = date ? format(date, "yyyy-MM-dd") : "";
                                    field.onChange(newDep);

                                    const ret = watch("returnDate");
                                    if (ret && date && new Date(ret) < date) {
                                        setValue("returnDate", undefined);
                                    }
                                }}
                                placeholder="Departure"
                                className={cn(errors.departureDate && "border-destructive")}
                                minDate={new Date()}
                            />
                        )}
                    />
                </div>

                <div className={"lg:col-span-2 " + (tripType === "one-way" ? "opacity-50 grayscale pointer-events-none" : "")}>
                    <Controller
                        name="returnDate"
                        control={control}
                        render={({ field }) => {
                            const depDate = watch("departureDate");
                            return (
                                <DatePicker
                                    date={field.value ? new Date(field.value) : undefined}
                                    setDate={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                                    placeholder="Return"
                                    className={cn(errors.returnDate && "border-destructive")}
                                    minDate={depDate ? new Date(depDate) : new Date()}
                                />
                            );
                        }}
                    />
                </div>

                <div className="lg:col-span-2 lg:row-start-2 lg:col-start-1">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between h-12">
                                <span className="flex items-center gap-2">
                                    <Plane className="h-4 w-4 text-muted-foreground" />
                                    {tripType === "round-trip" ? "Round-trip" : "One-way"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1" align="start">
                            <div className="flex flex-col">
                                <button
                                    className={cn("px-3 py-2 text-left text-sm rounded-sm hover:bg-accent", tripType === "round-trip" && "font-semibold bg-accent/50")}
                                    onClick={() => {
                                        setValue("returnDate", undefined);
                                        if (tripType === "one-way") {
                                            const dep = watch("departureDate");
                                            const date = dep ? new Date(dep) : new Date();
                                            date.setDate(date.getDate() + 7);
                                            setValue("returnDate", format(date, "yyyy-MM-dd"));
                                        }
                                    }}
                                >
                                    Round-trip
                                </button>
                                <button
                                    className={cn("px-3 py-2 text-left text-sm rounded-sm hover:bg-accent", tripType === "one-way" && "font-semibold bg-accent/50")}
                                    onClick={() => setValue("returnDate", undefined)}
                                >
                                    One-way
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="lg:col-span-2 lg:row-start-2 lg:col-start-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between h-12">
                                <span className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Pax</span>
                                    <Controller
                                        name="adults"
                                        control={control}
                                        render={({ field }) => (
                                            <span className="font-semibold text-foreground">{field.value}</span>
                                        )}
                                    />
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-4" align="start">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">Adults</span>
                                    <span className="text-xs text-muted-foreground">Age 12+</span>
                                </div>
                                <Controller
                                    name="adults"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                disabled={field.value <= 1}
                                                onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                            >
                                                -
                                            </Button>
                                            <span className="w-4 text-center font-medium">{field.value}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                disabled={field.value >= 9}
                                                onClick={() => field.onChange(Math.min(9, field.value + 1))}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    )}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="lg:col-span-3 lg:row-start-2 lg:col-start-5">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between h-12">
                                <Controller
                                    name="travelClass"
                                    control={control}
                                    render={({ field }) => (
                                        <span className="font-medium text-foreground uppercase tracking-wide text-xs">
                                            {field.value === "PREMIUM_ECONOMY" ? "Premium Econ" : field.value === "FIRST" ? "First Class" : field.value.replace("_", " ")}
                                        </span>
                                    )}
                                />
                                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1" align="start">
                            <div className="flex flex-col">
                                <Controller
                                    name="travelClass"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {[
                                                { value: "ECONOMY", label: "Economy" },
                                                { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
                                                { value: "BUSINESS", label: "Business" },
                                                { value: "FIRST", label: "First Class" }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    className={cn(
                                                        "px-3 py-2 text-left text-sm rounded-sm hover:bg-accent transition-colors",
                                                        field.value === option.value && "font-semibold bg-accent/50"
                                                    )}
                                                    onClick={() => field.onChange(option.value)}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <Button type="submit" size="lg" className="w-full lg:col-span-5 lg:row-start-2 lg:col-start-8 rounded-lg font-bold h-12">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                </Button>
            </form>
        </div>
    );
}
