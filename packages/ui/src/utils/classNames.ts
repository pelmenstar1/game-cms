type Part = string | undefined | null | false;

export function classNames(...parts: Part[]) {
  return parts.filter(Boolean).join(' ');
}
