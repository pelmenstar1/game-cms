export function getUrlFileName(value: string) {
  const slashIndex = value.lastIndexOf('/');

  return slashIndex !== -1 ? value.slice(slashIndex + 1) : value;
}
