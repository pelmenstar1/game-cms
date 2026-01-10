export type DateLike = string | number | Date;

export function resolveDateLike(value: DateLike): Date;
export function resolveDateLike(value: DateLike | undefined): Date | undefined;

export function resolveDateLike(value: DateLike | undefined): Date | undefined {
  if (value === undefined || value instanceof Date) {
    return value;
  }

  return new Date(value);
}
