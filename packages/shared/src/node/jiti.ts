import type { Jiti, JitiResolveOptions } from 'jiti';

export async function maybeJitiImport<T>(
  jiti: Jiti,
  id: string,
  // We cannot allow passing `default` here, because it can't differentiate between "module not found" and "module found but has no default export" cases,
  // which is crucial for our use case
  opts?: Omit<JitiResolveOptions, 'default'>
) {
  const result = await jiti.import<T | undefined>(id, { ...opts, try: true });

  return result;
}
