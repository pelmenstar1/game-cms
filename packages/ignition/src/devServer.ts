import z from 'zod';

export const devServerManifest = z.object({
  address: z.string(),
});

export type DevServerManifest = z.infer<typeof devServerManifest>;
