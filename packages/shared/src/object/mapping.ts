export function mapObject<K extends PropertyKey, T, R>(
  obj: Record<K, T>,
  mapping: (value: T) => R
) {
  return Object.fromEntries(
    Object.entries<T>(obj).map(([key, value]) => [key, mapping(value)] as const)
  ) as Record<K, R>;
}
