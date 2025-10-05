export function getViewPages(
  current: number,
  total: number
): (number | null)[] {
  const pages: number[] = [];

  if (current > 2) {
    pages.push(1);
  }

  if (current === total && total > 2 && !pages.includes(current - 2)) {
    pages.push(current - 2);
  }

  if (current > 1) {
    pages.push(current - 1);
  }

  pages.push(current);

  if (current < total) {
    pages.push(current + 1);
  }

  if (current === 1 && total > 2) {
    pages.push(current + 2);
  }

  if (current < total - 1 && !pages.includes(total)) {
    pages.push(total);
  }

  const result = pages as (number | null)[];

  if (pages.length > 2) {
    if (pages[1] - pages[0] > 1) {
      result.splice(1, 0, null);
    }

    // eslint-disable-next-line unicorn/prefer-at
    if (pages[pages.length - 1] - pages[pages.length - 2] > 1) {
      result.splice(pages.length - 1, 0, null);
    }
  }

  return pages;
}
