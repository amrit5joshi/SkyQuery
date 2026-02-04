"use client";

import Link from "next/link";
import { Plane } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Header() {
    const handleComingSoon = (e: React.MouseEvent) => {
        e.preventDefault();
        alert("Feature coming soon!");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                            <Plane className="h-5 w-5 -rotate-45" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SkyQuery</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            Flights
                        </Link>
                        <Link
                            href="#"
                            onClick={handleComingSoon}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            Hotels
                        </Link>
                        <Link
                            href="#"
                            onClick={handleComingSoon}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            Explore
                        </Link>
                    </nav>
                </div>
            </Container>
        </header>
    );
}
