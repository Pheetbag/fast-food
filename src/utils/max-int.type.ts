/**
 * A utility type that generates a union type of all integers from 0 up
 * to a specified maximum value.
 */
export type MaxInt<
    MaxValue extends number,
    Acc extends number[] = [],
> = Acc["length"] extends MaxValue
    ? [...Acc, MaxValue][number]
    : MaxInt<MaxValue, [...Acc, Acc["length"]]>;
