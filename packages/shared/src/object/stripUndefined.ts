export function stripUndefined<K extends PropertyKey, T>(
  value: Record<K, T>
): Partial<Record<K, T>> {
  const result: Partial<Record<K, T>> = {};

  for (const key in value) {
    const propValue = value[key];

    if (propValue !== undefined) {
      result[key] = propValue;
    }
  }

  return result;
}
