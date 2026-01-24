import { componentCore } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

import { getDefaultData } from './internal/defaultData.js';

export default componentCore({
  id: 'base::date',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: (options) => getDefaultData(options).toString(),
  validator: (data, options) => {
    if (typeof data !== 'string') {
      return 'INVALID_TYPE';
    }

    const date = Date.parse(data);

    if (options.minDate && date < resolveDateLike(options.minDate).getTime()) {
      return 'TOO_EARLY';
    }

    if (options.maxDate && date > resolveDateLike(options.maxDate).getTime()) {
      return 'TOO_LATE';
    }
  },
});
