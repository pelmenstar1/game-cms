import { component } from '@game-cms/core';
import { ObjectId } from 'mongodb';

import meta from './meta.js';
import { validator } from './validator.js';

export default component({
  meta,
  validator,
  storageResolver: {
    toStorage: (data) => data.map((item) => new ObjectId(item)),
    fromStorage: (data) => data.map((id) => id.toString()),
  },
});
