export function randomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

/**
 * Generate a unique ID string, using current timestamp and a random number.
 * Is not safe for generating a lof of IDs in a short time span.
 */
export function uniqueId(): string {
    return (
        Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
    ).toUpperCase();
}
