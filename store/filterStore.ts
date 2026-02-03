import { create } from "zustand";

interface FilterStore {
    maxPrice: number | null;
    stops: number[];
    airlines: string[];

    setMaxPrice: (price: number | null) => void;
    setStops: (stops: number[]) => void;
    toggleStop: (stop: number) => void;
    setAirlines: (airlines: string[]) => void;
    toggleAirline: (airline: string) => void;
    reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
    maxPrice: null,
    stops: [],
    airlines: [],

    setMaxPrice: (price) => set({ maxPrice: price }),

    setStops: (stops) => set({ stops }),

    toggleStop: (stop) =>
        set((state) => {
            const exists = state.stops.includes(stop);
            return {
                stops: exists
                    ? state.stops.filter((s) => s !== stop)
                    : [...state.stops, stop],
            };
        }),

    setAirlines: (airlines) => set({ airlines }),

    toggleAirline: (airline) =>
        set((state) => {
            const exists = state.airlines.includes(airline);
            return {
                airlines: exists
                    ? state.airlines.filter((a) => a !== airline)
                    : [...state.airlines, airline],
            };
        }),

    reset: () => set({ maxPrice: null, stops: [], airlines: [] }),
}));
