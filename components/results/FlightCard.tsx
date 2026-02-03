import { FlightOffer, FlightItinerary, FlightSegment } from "@/types/flight";
import { formatCurrency, formatDuration, formatTime } from "@/lib/format/utils";
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
                    <ItineraryRow key={idx} itinerary={itinerary} />
                ))}
            </div>

            <div className="flex flex-col items-end gap-2 sm:border-l sm:pl-6">
                <div className="text-2xl font-bold text-primary">
                    {formatCurrency(offer.price.total, offer.price.currency)}
                </div>
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
                <Button size="sm">Select</Button>
            </div>
        </div>
    );
}

function ItineraryRow({ itinerary }: { itinerary: FlightItinerary }) {
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const stops = itinerary.segments.length - 1;

    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 w-12">
                <div className="font-bold text-muted-foreground">{firstSegment.carrierCode}</div>
            </div>

            <div className="flex flex-1 items-center justify-between gap-4">
                <div className="text-right">
                    <div className="text-lg font-semibold">
                        {formatTime(firstSegment.departure.at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {firstSegment.departure.iataCode}
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center px-4">
                    <div className="mb-3 text-xs text-muted-foreground">
                        {formatDuration(itinerary.duration)}
                    </div>
                    <div className="relative w-full border-t border-muted-foreground/30">
                        {stops > 0 && (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-background px-1 text-[10px] text-muted-foreground">
                                {stops} stop{stops > 1 ? "s" : ""}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-left">
                    <div className="text-lg font-semibold">
                        {formatTime(lastSegment.arrival.at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {lastSegment.arrival.iataCode}
                    </div>
                </div>
            </div>
        </div>
    );
}
