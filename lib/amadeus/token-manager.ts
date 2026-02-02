interface TokenResponse {
    access_token: string;
    expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpirationTime: number = 0;

export async function getAmadeusToken(): Promise<string> {
    const currentTime = Date.now();

    // Return cached token if still valid (minus 10 second buffer)
    if (cachedToken && currentTime < tokenExpirationTime - 10000) {
        return cachedToken;
    }

    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    const isTestEnv = process.env.AMADEUS_ENV === "test";

    if (!clientId || !clientSecret) {
        throw new Error("Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET");
    }

    const url = isTestEnv
        ? "https://test.api.amadeus.com/v1/security/oauth2/token"
        : "https://api.amadeus.com/v1/security/oauth2/token";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            }),
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch Amadeus token: ${response.statusText} - ${errorText}`);
        }

        const data: TokenResponse = await response.json();

        cachedToken = data.access_token;
        // expires_in is in seconds, convert to ms
        tokenExpirationTime = currentTime + (data.expires_in * 1000);

        return cachedToken;
    } catch (error) {
        console.error("Amadeus Token Error:", error);
        throw error;
    }
}
