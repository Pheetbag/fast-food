export type ValueGetter<T> = T | (() => T);

export function resolveValueGetter<T>(state: ValueGetter<T>): T {
    if (state instanceof Function) {
        return state();
    } else {
        return state;
    }
}
