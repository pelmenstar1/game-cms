export function isFileNotFoundError(value: unknown) {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    value.code === 'ENOENT'
  );
}
