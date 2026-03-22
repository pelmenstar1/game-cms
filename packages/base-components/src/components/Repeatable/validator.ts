export function validator(data: unknown, validate: (data: unknown) => unknown) {
  if (!Array.isArray(data)) {
    return { ownError: 'INVALID_TYPE' as const };
  }

  const result = data.map(validate);

  if (result.some((item) => item !== undefined)) {
    return { items: result };
  }
}
