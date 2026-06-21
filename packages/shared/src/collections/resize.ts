export const resizeArray = <T>(
  array: readonly T[],
  size: number,
  placeholder: T
): T[] => {
  if (array.length < size) {
    const result = Array.from<T>({ length: size });
    for (let i = 0; i < array.length; i++) {
      result[i] = array[i];
    }

    result.fill(placeholder, array.length);

    return result;
  }

  if (array.length > size) {
    return array.slice(0, size);
  }

  return [...array];
};
