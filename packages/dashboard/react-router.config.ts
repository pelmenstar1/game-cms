import path from 'node:path';

import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  appDirectory: path.join(import.meta.dirname, './src/app'),
} satisfies Config;
