export function validator<S = unknown>(
  data: unknown,
  fns: {
    validateItem: (data: S) => unknown;
    validateStructure?: (data: unknown[]) => data is S[];
  }
) {
  const { validateStructure } = fns;
  if (!Array.isArray(data) || (validateStructure && !validateStructure(data))) {
    return { ownError: 'INVALID_TYPE' as const };
  }

  const result = data.map(fns.validateItem);

  if (result.some((item) => item !== undefined)) {
    return { items: result };
  }
}
