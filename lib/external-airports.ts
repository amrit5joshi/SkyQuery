const EXTERNAL_DATA_URL = 'https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json';

export interface Airport {
    iataCode: string;
    name: string;
    address: {
        cityName: string;
        countryName: string;
    };
    ranking: number;
}
// @ts-ignore
let cachedAirports: Airport[] | null = global.airportCache || null;

export async function getGlobalAirports(): Promise<Airport[]> {
    if (cachedAirports && cachedAirports.length > 0) {
        return cachedAirports;
    }

    try {
        const response = await fetch(EXTERNAL_DATA_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch external airports: ${response.statusText}`);
        }

        const rawData = await response.json();

        const processed: Airport[] = rawData
            .filter((a: any) => a.iata_code && a.name && a.city && a.country)
            .map((a: any) => ({
                iataCode: a.iata_code.toUpperCase(),
                name: a.name.replace(/"/g, ''),
                address: {
                    cityName: a.city.toUpperCase().replace(/"/g, ''),
                    countryName: a.country.toUpperCase().replace(/"/g, '')
                },
                ranking: a.links_count || 0
            }))
            .sort((a: Airport, b: Airport) => b.ranking - a.ranking);

        cachedAirports = processed;

        // @ts-ignore
        global.airportCache = processed;

        return processed;

    } catch (error) {
        return [];
    }
}
