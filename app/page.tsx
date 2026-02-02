import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SearchForm } from "@/components/search/SearchForm";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Home() {
    return (
        <Container className="py-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
                        Find your next adventure.
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                        Search competitive flight deals in real-time. Where will you go next?
                    </p>
                </div>

                <div className="w-full max-w-4xl">
                    <Suspense fallback={<div className="h-24 w-full rounded-lg bg-muted animate-pulse" />}>
                        <SearchForm />
                    </Suspense>
                </div>
            </div>
        </Container>
    );
}
