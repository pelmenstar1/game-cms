import type z from 'zod';

import type { spritesheetDataWithSize } from './schema';

export type SpritesheetDataWithSize = z.infer<typeof spritesheetDataWithSize>;
