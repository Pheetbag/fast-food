/**
 * A utility type that creates a tuple (fixed-length array) of a specified type and length.
 */
export type FixedArray<
    Type,
    Length extends number,
    Acc extends Type[] = [],
> = Acc["length"] extends Length
    ? Acc
    : FixedArray<Type, Length, [...Acc, Type]>;
