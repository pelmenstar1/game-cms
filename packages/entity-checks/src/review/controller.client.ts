import { defineEntityCheckClientController } from '@game-cms/base-core';

export default defineEntityCheckClientController({
  renderer: () => import('./renderer'),
  isAllowed: ({ data, documentVariant, options }) => {
    if (documentVariant !== 'published' && options.onlyForPublished) {
      return true;
    }

    return data?.reviewers.every((item) => item.approved) ?? false;
  },
});
