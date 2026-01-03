import { component } from '@game-cms/core';
import { ObjectId } from 'mongodb';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  storageResolver: {
    toStorage: (data) => data.map((item) => new ObjectId(item)),
    fromStorage: (data) => data.map((id) => id.toString()),
  },
});
