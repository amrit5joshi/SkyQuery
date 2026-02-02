export function formatCurrency(amount: string | number, currency: string = "EUR"): string {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(value);
}

export function formatDuration(isoDuration: string): string {
    // Simple parser for PT1H30M format
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return isoDuration;

    const hours = match[1] ? match[1].replace("H", "h") : "";
    const minutes = match[2] ? match[2].replace("M", "m") : "";

    return `${hours} ${minutes}`.trim();
}

export function formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
