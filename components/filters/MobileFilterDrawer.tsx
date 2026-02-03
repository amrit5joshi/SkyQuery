"use client";

import { Button } from "@/components/ui/Button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/Sheet";
import { FilterSidebar } from "./FilterSidebar";
import { SlidersHorizontal } from "lucide-react";

interface MobileFilterDrawerProps {
    maxPrice: number;
    airlines: string[];
}

export function MobileFilterDrawer({ maxPrice, airlines }: MobileFilterDrawerProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="pb-4">
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterSidebar maxPrice={maxPrice} airlines={airlines} />
            </SheetContent>
        </Sheet>
    );
}
