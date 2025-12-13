import { env } from '@game-cms/global';
import type { ValueSourceContext } from '@game-cms/types';

import { compiledFilePath } from '../../utils/localPath.js';

export function valueSourceContext(): ValueSourceContext {
  const { config } = env();

  return {
    config,
    compiledFilePath,
  };
}
