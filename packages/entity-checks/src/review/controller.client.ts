import { defineEntityCheckClientController } from '@game-cms/base-core';

export default defineEntityCheckClientController({
  renderer: () => import('./renderer'),
  isAllowed: ({ data, documentVariant }) => {
    return (
      documentVariant !== 'published' ||
      data.reviewers.every((item) => item.approved)
    );
  },
});
