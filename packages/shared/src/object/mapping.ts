export function mapObject<T extends Record<PropertyKey, unknown>, R>(
  obj: T,
  mapping: (value: T[keyof T]) => R
) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]) => [key, mapping(value as T[keyof T])] as const
    )
  ) as Record<keyof T, R>;
}
