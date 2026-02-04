"use client";

import Image from "next/image";
import { useState } from "react";
import { Plane } from "lucide-react";
import { getAirlineName } from "@/lib/airlines";

interface AirlineLogoProps {
    carrierCode: string;
    className?: string;
    showName?: boolean;
}

export function AirlineLogo({ carrierCode, className = "", showName = true }: AirlineLogoProps) {
    const [imageError, setImageError] = useState(false);
    const airlineName = getAirlineName(carrierCode);

    const logoUrl = `https://images.kiwi.com/airlines/64/${carrierCode}.png`;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative h-8 w-8 flex-shrink-0 rounded overflow-hidden bg-muted">
                {!imageError ? (
                    <Image
                        src={logoUrl}
                        alt={airlineName}
                        fill
                        className="object-contain p-1"
                        onError={() => setImageError(true)}
                        unoptimized
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Plane className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
            </div>
            {showName && (
                <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">{airlineName}</span>
                    <span className="text-xs text-muted-foreground">{carrierCode}</span>
                </div>
            )}
        </div>
    );
}
