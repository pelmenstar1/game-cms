export default {
  mergeConfigs: (
    base: Record<string, unknown>,
    next: Record<string, unknown>
  ) => ({ ...base, ...next }),
};
