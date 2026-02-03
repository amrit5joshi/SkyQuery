"use client";

import { useFilterStore } from "@/store/filterStore";
import { Slider } from "@/components/ui/Slider";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format/utils";

interface FilterSidebarProps {
    maxPrice: number;
    airlines: string[];
}

export function FilterSidebar({ maxPrice, airlines }: FilterSidebarProps) {
    const {
        maxPrice: selectedMaxPrice,
        setMaxPrice,
        stops: selectedStops,
        toggleStop,
        airlines: selectedAirlines,
        toggleAirline,
        reset
    } = useFilterStore();

    const currentMaxPrice = selectedMaxPrice ?? maxPrice;

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={reset} className="h-auto p-0 text-xs text-muted-foreground">
                        Reset
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Stops</h4>
                <div className="space-y-2">
                    {[0, 1, 2].map((stop) => (
                        <div key={stop} className="flex items-center space-x-2">
                            <Checkbox
                                id={`stop-${stop}`}
                                checked={selectedStops.includes(stop)}
                                onCheckedChange={() => toggleStop(stop)}
                            />
                            <Label htmlFor={`stop-${stop}`} className="text-sm font-normal">
                                {stop === 0 ? "Non-stop" : `${stop} Stop${stop > 1 ? "s" : ""}`}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Max Price</h4>
                    <span className="text-xs text-muted-foreground">
                        {formatCurrency(currentMaxPrice)}
                    </span>
                </div>
                <Slider
                    defaultValue={[maxPrice]}
                    value={[currentMaxPrice]}
                    max={maxPrice}
                    step={10}
                    onValueChange={(val) => setMaxPrice(val[0])}
                    className="py-4"
                />
            </div>

            {airlines.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Airlines</h4>
                    <div className="space-y-2">
                        {airlines.map((airline) => (
                            <div key={airline} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`airline-${airline}`}
                                    checked={selectedAirlines.includes(airline)}
                                    onCheckedChange={() => toggleAirline(airline)}
                                />
                                <Label htmlFor={`airline-${airline}`} className="text-sm font-normal">
                                    {airline}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
