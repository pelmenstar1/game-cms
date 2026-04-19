export function filterAnimations(
  animations: string[],
  query: string
): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return animations;
  }

  return animations.filter((name) => name.toLowerCase().includes(trimmed));
}
