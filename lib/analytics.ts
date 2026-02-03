import { FlightOffer } from "@/types/flight";

export interface PricePoint {
    price: number;
    count: number;
    label: string;
}

export function generatePriceHistogram(flights: FlightOffer[], binSize: number = 50): PricePoint[] {
    if (!flights.length) return [];

    const prices = flights.map((f) => parseFloat(f.price.total));
    const min = Math.floor(Math.min(...prices) / binSize) * binSize;
    const max = Math.ceil(Math.max(...prices) / binSize) * binSize;

    const bins: Record<number, number> = {};

    for (let i = min; i < max; i += binSize) {
        bins[i] = 0;
    }
    prices.forEach((price) => {
        const bin = Math.floor(price / binSize) * binSize;
        if (bins[bin] !== undefined) {
            bins[bin]++;
        }
    });

    return Object.entries(bins).map(([binStart, count]) => {
        const start = parseInt(binStart);
        return {
            price: start,
            count,
            label: `€${start}`,
        };
    }).sort((a, b) => a.price - b.price);
}
