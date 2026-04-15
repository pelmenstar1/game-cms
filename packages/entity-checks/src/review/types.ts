import type { NoPasswordUser } from '@game-cms/base-core';
import type z from 'zod';

import type { updateReviewersPayload } from './schema.js';

export type ReviewOptions = {
  onlyForPublished?: boolean;
};

export type UpdateReviewersPayload = z.infer<typeof updateReviewersPayload>;

export type GetReviewersResponse = {
  users: NoPasswordUser[];
};

declare module '@game-cms/base-core' {
  interface EntityCheckTypeMap {
    'base::review': {
      clientData: {
        reviewers: {
          user: NoPasswordUser;
          approved: boolean;
        }[];
      };
      clientOptions: ReviewOptions;
      storageData: {
        reviewers: Record<string, { lastApproveTime?: number } | undefined>;
      };
      actions: {
        approve: null;
      };
    };
  }
}
