import { FlightOffer, FlightItinerary } from "@/types/flight";
import { formatCurrency, formatDuration, formatTime } from "@/lib/format/utils";
import { AirlineLogo } from "./AirlineLogo";
import { getAirlineName } from "@/lib/airlines";

interface FlightCardProps {
    offer: FlightOffer;
    isCheapest?: boolean;
    isFastest?: boolean;
}

export function FlightCard({ offer, ...props }: FlightCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-4">
                {offer.itineraries.map((itinerary, idx) => (
                    <div key={idx} className="space-y-1">
                        {offer.itineraries.length > 1 && (
                            <div className="text-xs font-medium text-muted-foreground">
                                {idx === 0 ? "Outbound" : "Return"}
                            </div>
                        )}
                        <ItineraryRow itinerary={itinerary} />
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-end gap-2 sm:border-l sm:pl-6">
                <div className="text-2xl font-bold text-primary">
                    {formatCurrency(offer.price.total, offer.price.currency)}
                </div>
                {offer.numberOfBookableSeats < 10 && (
                    <div className="text-[10px] text-orange-600 font-medium">
                        Only {offer.numberOfBookableSeats} seats left
                    </div>
                )}
                <div className="flex gap-2">
                    {props.isCheapest && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Cheapest
                        </span>
                    )}
                    {props.isFastest && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Fastest
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ItineraryRow({ itinerary }: { itinerary: FlightItinerary }) {
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const stops = itinerary.segments.length - 1;
    const layovers = itinerary.segments.slice(0, -1).map(s => s.arrival.city || s.arrival.iataCode).join(", ");

    return (
        <div className="flex items-center gap-3 sm:gap-6 text-sm relative py-1">
            <div className="flex flex-col items-end min-w-[75px] sm:min-w-[90px]">
                <div className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                    {formatTime(firstSegment.departure.at)}
                </div>
                <div className="flex flex-col items-end leading-none mt-1">
                    <span className="text-sm font-bold text-muted-foreground">{firstSegment.departure.iataCode}</span>
                    {firstSegment.departure.city && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[85px] text-right mt-0.5 font-medium">
                            {firstSegment.departure.city}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col items-center px-2 sm:px-4 min-w-0 z-10">
                <div className="flex items-center gap-1.5 mb-2">
                    <AirlineLogo carrierCode={firstSegment.carrierCode} showName={false} />
                    <div className="text-[10px] sm:text-xs font-semibold text-foreground truncate max-w-[120px] hidden sm:block">
                        {getAirlineName(firstSegment.carrierCode)}
                    </div>
                </div>

                <div className="mb-2 text-[10px] sm:text-xs text-muted-foreground font-medium">
                    {formatDuration(itinerary.duration)}
                </div>
                <div className="relative w-full flex items-center justify-center">
                    <div className="absolute w-full h-px bg-border/60 top-1/2 -z-10" />
                    {stops > 0 ? (
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap max-w-full truncate">
                            {stops} stop{stops > 1 ? "s" : ""} {layovers && <span className="font-medium opacity-90 hidden sm:inline">in {layovers}</span>}
                        </div>
                    ) : (
                        <div className="bg-background px-2 text-[10px] text-muted-foreground font-medium">
                            Direct
                        </div>
                    )}
                </div>
                {stops > 0 && layovers && (
                    <div className="mt-1.5 text-[9px] text-orange-600/90 font-medium sm:hidden max-w-full truncate">
                        {layovers}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start min-w-[75px] sm:min-w-[90px]">
                <div className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                    {formatTime(lastSegment.arrival.at)}
                </div>
                <div className="flex flex-col items-start leading-none mt-1">
                    <span className="text-sm font-bold text-muted-foreground">{lastSegment.arrival.iataCode}</span>
                    {lastSegment.arrival.city && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[85px] text-left mt-0.5 font-medium">
                            {lastSegment.arrival.city}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
