import { defineEntityCheckClientController } from '@game-cms/base-core';

export default defineEntityCheckClientController({
  renderer: () => import('./renderer'),
  isAllowed: ({ data, documentVariant, options }) => {
    if (options.onlyForPublished && documentVariant !== 'published') {
      return true;
    }

    return data.reviewers.every((item) => item.approved);
  },
});
