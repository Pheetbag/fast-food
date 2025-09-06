export function randomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

let currentGeneratedId = 0;
/**
 * Generates unique IDs that remain unique across the entire game.
 * We shouldn't relay on the shape/structure of the ID, just that it's unique, because the implementation
 * might change in the future, depending on the needs.
 */
export function getUniqueId(): string {
    return String(++currentGeneratedId);
}
