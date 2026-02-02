import { Button } from "@/components/ui/Button";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "price" | "duration" | "cheapest";

interface ResultsToolbarProps {
    totalResults: number;
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export function ResultsToolbar({ totalResults, currentSort, onSortChange }: ResultsToolbarProps) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
                Found <span className="font-medium text-foreground">{totalResults}</span> results
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                    variant={currentSort === "price" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSortChange("price")}
                    className="h-8"
                >
                    Price
                </Button>
                <Button
                    variant={currentSort === "duration" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSortChange("duration")}
                    className="h-8"
                >
                    Duration
                </Button>
            </div>
        </div>
    );
}
