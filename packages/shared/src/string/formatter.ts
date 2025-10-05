export function formatTwoDigit(value: number): string {
  return value.toString().padStart(2, '0');
}
