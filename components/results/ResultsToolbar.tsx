import { Button } from "@/components/ui/Button";

export type SortOption = "price" | "duration" | "cheapest";

interface ResultsToolbarProps {
    totalResults: number;
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    travelClass?: string;
    adults?: number;
}

export function ResultsToolbar({ totalResults, currentSort, onSortChange, travelClass, adults }: ResultsToolbarProps) {
    const classLabel = travelClass?.toLowerCase().replace("_", " ") || "economy";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                    {classLabel} • {adults || 1} {(adults || 1) > 1 ? "Travelers" : "Traveler"}
                </div>
                <div className="text-sm text-muted-foreground">
                    Found <span className="font-medium text-foreground">{totalResults}</span> results
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-primary"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        const btn = document.getElementById("share-btn-text");
                        if (btn) {
                            btn.innerText = "Copied!";
                            setTimeout(() => (btn.innerText = "Share"), 2000);
                        }
                    }}
                >
                    <span id="share-btn-text">Share</span>
                </Button>

                <div className="h-4 w-[1px] bg-border mx-2" />

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
